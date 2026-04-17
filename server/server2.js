import dotenv from "dotenv";
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import crypto from "node:crypto";
import axios from "axios";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

// ─────────────────────────────
// MEMORY
// ─────────────────────────────
const roomMessages = new Map();
const waitingRooms = new Map();

function getRoomHistory(roomId) {
    return roomMessages.get(roomId) || [];
}

function appendRoomMessage(roomId, msg) {
    const history = getRoomHistory(roomId);
    roomMessages.set(roomId, [...history, msg].slice(-100));
}

// ─────────────────────────────
// TELEGRAM
// ─────────────────────────────
async function notifyTelegram({ roomId, visitorName, pageUrl }) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.log("❌ Missing Telegram env");
        return;
    }

    const text =
        `🟢 Nouveau visiteur

👤 ${visitorName}
🆔 Room: ${roomId}
🌐 Page: ${pageUrl}`;

    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text,
        });
    } catch (err) {
        console.log("❌ Telegram error:", err.response?.data || err.message);
    }
}

// ─────────────────────────────
// CREATE / NOTIFY ROOM
// ─────────────────────────────
app.post("/api/live-chat/notify", async (req, res) => {
    const roomId = req.body?.roomId || crypto.randomUUID();
    const visitorName = req.body?.visitorName || "Anonyme";
    const pageUrl = req.body?.pageUrl || "";

    // create room if not exists
    if (!waitingRooms.has(roomId)) {
        waitingRooms.set(roomId, {
            roomId,
            visitorName,
            pageUrl,
            status: "waiting",
            createdAt: new Date().toISOString(),
        });
    }

    // broadcast to admin
    io.emit("rooms-updated", [...waitingRooms.values()]);

    // notify telegram
    await notifyTelegram({ roomId, visitorName, pageUrl });

    res.json({ ok: true, roomId });
});

// ─────────────────────────────
// GET ROOMS (IMPORTANT)
// ─────────────────────────────
app.get("/api/live-chat/rooms", (req, res) => {
    res.json({
        rooms: [...waitingRooms.values()],
    });
});

// ─────────────────────────────
// SOCKET
// ─────────────────────────────
io.on("connection", (socket) => {
    console.log("🟢 Connecté:", socket.id);

    // IMPORTANT: send rooms immediately on connect (FIX ADMIN EMPTY)
    socket.emit("rooms-updated", [...waitingRooms.values()]);

    socket.on("join-room", ({ roomId }) => {
        socket.join(roomId);
        socket.data.roomId = roomId;

        socket.emit("history", getRoomHistory(roomId));
    });

    socket.on("message", (data) => {
        const roomId = data.roomId || socket.data.roomId;
        const text = (data.text || "").toString().trim();
        const sender = data.sender;

        if (!roomId || !text) return;

        const msg = {
            id: crypto.randomUUID(),
            roomId,
            text,
            sender,
            time: new Date().toISOString(),
        };

        appendRoomMessage(roomId, msg);

        // update room status
        if (waitingRooms.has(roomId)) {
            const room = waitingRooms.get(roomId);

            room.lastMessageAt = msg.time;
            room.status = sender === "visitor" ? "waiting" : "active";

            waitingRooms.set(roomId, room);
        }

        io.to(roomId).emit("message", msg);
        io.emit("rooms-updated", [...waitingRooms.values()]);

        console.log(`💬 [${sender}] ${text}`);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Déconnecté:", socket.id);
    });
});

server.listen(process.env.PORT || 3001, () => {
    console.log("🚀 Serveur lancé sur http://localhost:3001");
});