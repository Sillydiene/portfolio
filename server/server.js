import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://portfolio-seven-lyart-91.vercel.app",
    "https://portfolio-e760yyryd-sillydienes-projects.vercel.app"
];

// 🔥 CORS EXPRESS
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
}));

// 🔥 ROUTE TEST
app.get("/", (req, res) => {
    res.send("Backend OK 🚀");
});

const server = http.createServer(app);

// 🔥 SOCKET.IO CONFIG
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["polling", "websocket"] // 🔥 IMPORTANT
});

// 🔥 CONNECTION
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