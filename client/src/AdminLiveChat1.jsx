import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3001";

export default function AdminLiveChat() {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const s = io(SERVER_URL, { transports: ["websocket"] });

        setSocket(s);

        s.on("connect", () => {
            setConnected(true);
            console.log("🟢 Admin connecté");
        });

        s.on("disconnect", () => setConnected(false));

        // LIVE ROOMS
        s.on("rooms-updated", (data) => {
            setRooms(data || []);
        });

        // HISTORY
        s.on("history", (history) => {
            setMessages(history || []);
        });

        // LIVE MESSAGE
        s.on("message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => s.disconnect();
    }, []);

    const joinRoom = (roomId) => {
        setActiveRoom(roomId);
        setMessages([]);

        socket.emit("join-room", {
            roomId,
            role: "admin",
        });
    };

    const sendMessage = (text) => {
        if (!text || !socket || !activeRoom) return;

        socket.emit("message", {
            roomId: activeRoom,
            text,
            sender: "admin",
        });
    };

    return (
        <div className="flex h-screen font-sans bg-gray-100">

            {/* ROOMS */}
            <div className="w-80 bg-white border-r p-4">
                <h2 className="text-lg font-bold mb-2">Admin Live Chat</h2>

                <p className="text-sm mb-4">
                    Socket: {connected ? "🟢 connecté" : "🔴 déconnecté"}
                </p>

                {rooms.map((r) => (
                    <div
                        key={r.roomId}
                        onClick={() => joinRoom(r.roomId)}
                        className={`p-3 mb-2 cursor-pointer rounded border ${
                            activeRoom === r.roomId ? "bg-blue-100" : "bg-white"
                        }`}
                    >
                        <div className="font-semibold">{r.visitorName}</div>
                        <div className="text-xs text-gray-500">{r.status}</div>
                    </div>
                ))}
            </div>

            {/* CHAT */}
            <div className="flex-1 flex flex-col">

                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex ${
                                m.sender === "admin" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`p-2 m-1 rounded-lg max-w-xs ${
                                    m.sender === "admin"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                {m.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* INPUT */}
                <div className="p-3 border-t bg-white">
                    <input
                        className="w-full p-2 border rounded"
                        placeholder="Message..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage(e.target.value);
                                e.target.value = "";
                            }
                        }}
                    />
                </div>

            </div>
        </div>
    );
}