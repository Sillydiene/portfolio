import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// ✅ route test
app.get("/", (req, res) => {
    res.send("Backend OK 🚀");
});

// 🔥 CORS FIX (TEMPORAIRE POUR TEST)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));

const server = http.createServer(app);

// 🔥 SOCKET.IO FIX
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    transports: ["polling"] // important pour Render
});

// 🔥 CHAT
io.on("connection", (socket) => {
    console.log("🔥 User connected:", socket.id);

    socket.on("send_message", (data) => {
        console.log("📩 Message:", data);
        io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});