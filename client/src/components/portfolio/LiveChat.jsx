import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MessageCircle } from "lucide-react";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket", "polling"]
});

export default function LiveChat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState(0);

    const [name, setName] = useState("");
    const [nameSet, setNameSet] = useState(false);

    const [typingUser, setTypingUser] = useState("");

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("users_count", (count) => {
            setUsers(count);
        });

        socket.on("typing", (user) => {
            setTypingUser(user);
        });

        socket.on("stop_typing", () => {
            setTypingUser("");
        });

        return () => {
            socket.off("receive_message");
            socket.off("users_count");
            socket.off("typing");
            socket.off("stop_typing");
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;

        const msgData = {
            message,
            time: new Date().toLocaleTimeString(),
            author: socket.id,
            name: name
        };

        socket.emit("send_message", msgData);
        socket.emit("stop_typing");

        setMessage("");
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);

        socket.emit("typing", name);

        setTimeout(() => {
            socket.emit("stop_typing");
        }, 1000);
    };

    return (
        <>
            {/* 🔥 NOUVEAU BOUTON STYLE WHATSAPP */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-105 transition-transform duration-300"
            >
                <MessageCircle className="w-6 h-6" />
            </button>

            {/* CHAT */}
            {open && (
                <div className="fixed bottom-24 right-5 w-80 bg-[#0b1a2b] rounded-xl shadow-lg border border-blue-400 z-50">

                    {/* HEADER */}
                    <div className="bg-blue-400 text-black p-3 flex justify-between items-center">
                        <span>Chat Live</span>
                        <button onClick={() => setOpen(false)}>✕</button>
                    </div>

                    {/* USERS */}
                    <div className="text-xs text-center text-gray-300 py-1">
                        👥 {users} utilisateur(s)
                    </div>

                    {!nameSet ? (
                        <div className="p-3">
                            <input
                                placeholder="Entrez votre nom"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 rounded bg-[#13263d] text-white"
                            />
                            <button
                                onClick={() => name && setNameSet(true)}
                                className="mt-2 w-full bg-blue-400 p-2 rounded"
                            >
                                Entrer
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* MESSAGES */}
                            <div className="h-60 overflow-y-auto p-3 text-white text-sm">
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`mb-2 ${
                                            msg.author === socket.id ? "text-right" : "text-left"
                                        }`}
                                    >
                                        <div className="text-xs opacity-60">
                                            {msg.name}
                                        </div>

                                        <div className="bg-[#13263d] p-2 rounded inline-block">
                                            {msg.message}
                                        </div>

                                        <div className="text-xs opacity-40">
                                            {msg.time}
                                        </div>
                                    </div>
                                ))}

                                {/* TYPING */}
                                {typingUser && (
                                    <div className="text-xs text-gray-400">
                                        ✍️ {typingUser} est en train d'écrire...
                                    </div>
                                )}
                            </div>

                            {/* INPUT */}
                            <div className="flex p-2 gap-2">
                                <input
                                    value={message}
                                    onChange={handleTyping}
                                    placeholder="Message..."
                                    className="flex-1 p-2 rounded bg-[#13263d] text-white"
                                />

                                <button
                                    onClick={sendMessage}
                                    className="bg-blue-400 px-3 rounded"
                                >
                                    ➤
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}