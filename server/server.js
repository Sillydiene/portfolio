import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// 🔥 DOMAINES AUTORISÉS
const allowedOrigins = [
    "http://localhost:5173",
    "https://portfolio-seven-lyart-91.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Backend OK 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// 🔥 USERS CONNECTÉS
let users = [];

io.on("connection", (socket) => {
    console.log("🔥 CONNECTED:", socket.id);

    // 🔹 JOIN USER
    socket.on("join", (username) => {
        users.push({ id: socket.id, username });
        io.emit("users", users.length);
    });

    // 🔹 SEND MESSAGE
    socket.on("send_message", (data) => {
        io.emit("receive_message", data);
    });

    // 🔹 TYPING
    socket.on("typing", (username) => {
        socket.broadcast.emit("typing", username);
    });

    // 🔹 DISCONNECT
    socket.on("disconnect", () => {
        users = users.filter(u => u.id !== socket.id);
        io.emit("users", users.length);
        console.log("❌ DISCONNECTED:", socket.id);
    });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
});