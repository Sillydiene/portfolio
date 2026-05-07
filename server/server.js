import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// 🔥 IMPORTANT : autoriser TOUS les domaines (fix CORS)
app.use(cors({
    origin: "*",
}));

// 🔥 ROUTE TEST (TRÈS IMPORTANT)
app.get("/", (req, res) => {
    res.send("Backend OK 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    transports: ["polling", "websocket"] // 🔥 important
});

// 🔥 SOCKET
io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

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
    console.log("🚀 Server running on port " + PORT);
});