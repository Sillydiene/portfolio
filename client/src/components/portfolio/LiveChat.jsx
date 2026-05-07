import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket", "polling"]
});

export default function LiveChat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState(0);

    useEffect(() => {
        // 🔥 recevoir messages
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        // 🔥 nombre utilisateurs
        socket.on("users_count", (count) => {
            setUsers(count);
        });

        return () => {
            socket.off("receive_message");
            socket.off("users_count");
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;

        const msgData = {
            message,
            time: new Date().toLocaleTimeString(),
            author: socket.id
        };

        socket.emit("send_message", msgData);

        // ❌ IMPORTANT : on NE fait PAS setMessages ici
        // sinon doublon

        setMessage("");
    };

    return (
        <>
            {/* Bouton flottant */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-5 right-5 bg-blue-400 w-14 h-14 rounded-full text-black text-xl z-50"
            >
                💬
            </button>

            {/* Chat */}
            {open && (
                <div className="fixed bottom-20 right-5 w-80 bg-[#0b1a2b] rounded-xl shadow-lg border border-blue-400 z-50">

                    {/* HEADER */}
                    <div className="bg-blue-400 text-black p-3 rounded-t-xl flex justify-between items-center">
                        <span>Chat Live</span>
                        <button onClick={() => setOpen(false)}>✕</button>
                    </div>

                    {/* USERS */}
                    <div className="text-xs text-center text-gray-300 py-1">
                        👥 {users} utilisateur(s) en ligne
                    </div>

                    {/* MESSAGES */}
                    <div className="h-60 overflow-y-auto p-3 text-white text-sm">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`mb-2 ${
                                    msg.author === socket.id ? "text-right" : "text-left"
                                }`}
                            >
                                <div className="bg-[#13263d] p-2 rounded-lg inline-block">
                                    {msg.message}
                                </div>
                                <div className="text-xs opacity-50">{msg.time}</div>
                            </div>
                        ))}
                    </div>

                    {/* INPUT */}
                    <div className="flex p-2 gap-2">
                        <input
                            className="flex-1 p-2 rounded bg-[#13263d] text-white outline-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-400 px-3 rounded text-black"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}