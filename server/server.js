import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// ✅ TEST ROUTE
app.get("/", (req, res) => {
    res.send("Backend OK 🚀");
});

const allowedOrigins = [
    "http://localhost:5173",
    "https://portfolio-seven-lyart-91.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
}));

// ✅ IMPORTANT
const server = http.createServer(app);

// ✅ SOCKET.IO ATTACHÉ AU SERVER HTTP
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["polling", "websocket"] // 🔥 important
});

// 🔥 DEBUG
io.on("connection", (socket) => {
    console.log("🔥 User connected:", socket.id);

    socket.on("send_message", (data) => {
        console.log("📩 Message reçu:", data);
        io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});

// ✅ PORT RENDER
const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});