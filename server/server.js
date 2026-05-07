import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// 🔥 CORS (simple et efficace)
app.use(cors({
    origin: "*"
}));

// 🔥 Route test
app.get("/", (req, res) => {
    res.send("Backend OK 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    transports: ["websocket", "polling"]
});

// 🔥 gestion utilisateurs
let users = 0;

io.on("connection", (socket) => {
    users++;
    console.log("✅ User connected:", socket.id);

    // 🔥 envoyer nombre utilisateurs
    io.emit("users_count", users);

    // 🔥 message
    socket.on("send_message", (data) => {
        console.log("📩 Message:", data);
        io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        users--;
        console.log("❌ User disconnected:", socket.id);

        io.emit("users_count", users);
    });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
});