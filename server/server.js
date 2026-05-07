import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "*"
}));

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

let users = 0;

io.on("connection", (socket) => {
    users++;
    console.log("✅ User connected:", socket.id);

    io.emit("users_count", users);

    // 🔥 message
    socket.on("send_message", (data) => {
        io.emit("receive_message", data);
    });

    // 🔥 typing
    socket.on("typing", (name) => {
        socket.broadcast.emit("typing", name);
    });

    socket.on("stop_typing", () => {
        socket.broadcast.emit("stop_typing");
    });

    socket.on("disconnect", () => {
        users--;
        io.emit("users_count", users);
    });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
});