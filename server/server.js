import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import crypto from "node:crypto";
import axios from "axios";
const firstMessages = new Map(); // roomId -> first message


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
// MEMORY STORE
// ─────────────────────────────
const roomMessages = new Map();
const waitingRooms = new Map();

const MAX_HISTORY = 100;

function getHistory(roomId) {
    return roomMessages.get(roomId) || [];
}

function saveMessage(roomId, msg) {
    const history = getHistory(roomId);
    roomMessages.set(roomId, [...history, msg].slice(-MAX_HISTORY));
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
🌐 ${pageUrl}`;

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
// NOTIFY (OPEN CHAT)
// ─────────────────────────────
app.post("/api/live-chat/notify", async (req, res) => {
    const roomId = req.body?.roomId || crypto.randomUUID();
    const visitorName = req.body?.visitorName || "Anonyme";
    const pageUrl = req.body?.pageUrl || "";

    if (!waitingRooms.has(roomId)) {
        waitingRooms.set(roomId, {
            roomId,
            visitorName,
            pageUrl,
            status: "waiting",
            createdAt: new Date().toISOString(),
        });
    }

    io.emit("rooms-updated", [...waitingRooms.values()]);

    await notifyTelegram({ roomId, visitorName, pageUrl });

    res.json({ ok: true, roomId });
});

// ─────────────────────────────
// ADMIN GET ROOMS (backup)
app.get("/api/live-chat/rooms", (req, res) => {
    res.json({ rooms: [...waitingRooms.values()] });
});

// ─────────────────────────────
// SOCKET SYSTEM
async function notifyTelegramFirstMessage({ roomId, visitorName, message }) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) return;

    const adminLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/chat?roomId=${roomId}`;

    const text =
        `🟢 Nouveau chat ouvert

👤 ${visitorName}
🆔 Room: ${roomId}

💬 Premier message:
"${message}"

👉 Ouvrir chat admin:
${adminLink}`;

    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text,
            disable_web_page_preview: true,
        });
    } catch (err) {
        console.log("❌ Telegram error:", err.response?.data || err.message);
    }
}
// ─────────────────────────────
io.on("connection", (socket) => {
    console.log("🟢 Connecté:", socket.id);

    // JOIN ROOM
    socket.on("join-room", ({ roomId, role }) => {
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.role = role;

        socket.emit("history", getHistory(roomId));
    });

    // MESSAGE
    socket.on("message", (data) => {
        const text = (data?.text || "").trim();
        const sender = data?.sender;
        const roomId = data?.roomId;

        if (!text || !roomId) return;

        const msg = {
            id: crypto.randomUUID(),
            roomId,
            text,
            sender,
            time: new Date().toISOString(),
        };

        saveMessage(roomId, msg);

        // ─────────────────────────────
        // 🔥 CAPTURE PREMIER MESSAGE VISITOR
        // ─────────────────────────────
        if (sender === "visitor" && !firstMessages.has(roomId)) {
            firstMessages.set(roomId, msg);

            // send Telegram with FIRST MESSAGE
            notifyTelegramFirstMessage({
                roomId,
                visitorName: "Visiteur portfolio",
                message: msg.text,
            });
        }

        io.to(roomId).emit("message", msg);

        console.log(`💬 [${sender}] ${text}`);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Déconnecté:", socket.id);
    });
});

server.listen(process.env.PORT || 3001, () => {
    console.log("🚀 Server running on http://localhost:3001");
});