import http from "node:http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const PORT = process.env.PORT || 3002;

// Storage
const rooms = new Map();
const users = new Map();

// Helper: JSON response
function sendJson(res, status, payload) {
    res.writeHead(status, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end(JSON.stringify(payload));
}

// HTTP server
const httpServer = http.createServer((req, res) => {

    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("API is running now");
    }

    // CORS preflight
    if (req.method === "OPTIONS") {
        return sendJson(res, 204, {});
    }

    // Create room
    if (req.url === "/api/rooms" && req.method === "POST") {
        const roomId = uuidv4();

        rooms.set(roomId, {
            id: roomId,
            participants: [],
            createdAt: new Date().toISOString(),
        });

        return sendJson(res, 200, { roomId });
    }

    // Check room
    if (req.url.startsWith("/api/rooms/") && req.method === "GET") {
        const roomId = req.url.split("/")[3];
        const room = rooms.get(roomId);

        if (room) {
            return sendJson(res, 200, {
                exists: true,
                participants: room.participants,
            });
        }

        return sendJson(res, 200, { exists: false });
    }

    // Not found
    return sendJson(res, 404, { error: "Not found" });
});

// Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join room
    socket.on("join-room", ({ roomId, userId, userName }) => {
        socket.join(roomId);

        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                id: roomId,
                participants: [],
                createdAt: new Date().toISOString(),
            });
        }

        const user = {
            id: userId,
            name: userName,
            socketId: socket.id,
        };

        users.set(socket.id, { ...user, roomId });

        const room = rooms.get(roomId);
        room.participants.push(user);

        socket.to(roomId).emit("user-joined", user);
        socket.emit("room-participants", room.participants);

        console.log(`${userName} joined room ${roomId}`);
    });

    // WebRTC signaling
    socket.on("offer", ({ offer, roomId }) => {
        socket.to(roomId).emit("offer", {
            offer,
            fromUserId: socket.id,
        });
    });

    socket.on("answer", ({ answer, roomId }) => {
        socket.to(roomId).emit("answer", {
            answer,
            fromUserId: socket.id,
        });
    });

    socket.on("ice-candidate", ({ candidate, roomId }) => {
        socket.to(roomId).emit("ice-candidate", {
            candidate,
            fromUserId: socket.id,
        });
    });

    // Chat
    socket.on("chat-message", ({ roomId, message, userId, userName }) => {
        io.to(roomId).emit("chat-message", {
            id: uuidv4(),
            message,
            userId,
            userName,
            timestamp: new Date().toISOString(),
        });
    });

    // Whiteboard
    socket.on("whiteboard-draw", ({ roomId, data }) => {
        socket.to(roomId).emit("whiteboard-draw", data);
    });

    socket.on("whiteboard-clear", ({ roomId }) => {
        socket.to(roomId).emit("whiteboard-clear");
    });

    // Media toggles
    socket.on("toggle-video", ({ roomId, userId, enabled }) => {
        socket.to(roomId).emit("user-video-toggled", { userId, enabled });
    });

    socket.on("toggle-audio", ({ roomId, userId, enabled }) => {
        socket.to(roomId).emit("user-audio-toggled", { userId, enabled });
    });

    // Disconnect
    socket.on("disconnect", () => {
        const user = users.get(socket.id);

        if (user) {
            const { roomId } = user;
            const room = rooms.get(roomId);

            if (room) {
                room.participants = room.participants.filter(
                    (p) => p.id !== user.id
                );

                socket.to(roomId).emit("user-left", user);

                if (room.participants.length === 0) {
                    rooms.delete(roomId);
                }
            }

            users.delete(socket.id);
        }

        console.log("User disconnected:", socket.id);
    });
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});