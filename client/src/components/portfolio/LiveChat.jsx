import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket", "polling"]
});

export default function LiveChat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState(0);
    const [typingUser, setTypingUser] = useState("");

    useEffect(() => {
        // 🔥 DEMANDE NOM
        const name = prompt("Entrez votre nom :");
        setUsername(name);

        socket.emit("join", name);

        socket.on("users", (count) => {
            setUsers(count);
        });

        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on("typing", (user) => {
            setTypingUser(user);
            setTimeout(() => setTypingUser(""), 2000);
        });

        return () => {
            socket.off("receive_message");
            socket.off("typing");
        };
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return;

        const msgData = {
            username,
            message,
            time: new Date().toLocaleTimeString(),
        };

        socket.emit("send_message", msgData);
        setMessages((prev) => [...prev, msgData]);
        setMessage("");
    };

    const handleTyping = () => {
        socket.emit("typing", username);
    };

    return (
        <>
            {/* 🔥 BOUTON */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-5 right-5 bg-blue-400 w-14 h-14 rounded-full text-black text-xl z-50"
            >
                💬
            </button>

            {/* 🔥 CHAT */}
            {open && (
                <div className="fixed bottom-20 right-5 w-80 bg-[#0b1a2b] rounded-xl shadow-lg border border-blue-400 z-50">

                    {/* HEADER */}
                    <div className="bg-blue-400 text-black p-3 rounded-t-xl flex justify-between">
                        Chat Live
                        <button onClick={() => setOpen(false)}>✕</button>
                    </div>

                    {/* USERS */}
                    <div className="text-xs text-center text-white py-1">
                        👥 {users} utilisateurs en ligne
                    </div>

                    {/* MESSAGES */}
                    <div className="h-60 overflow-y-auto p-3 text-white text-sm">
                        {messages.map((msg, i) => (
                            <div key={i} className="mb-2">
                                <div className="bg-[#13263d] p-2 rounded-lg inline-block">
                                    <strong>{msg.username}</strong>: {msg.message}
                                </div>
                                <div className="text-xs opacity-50">{msg.time}</div>
                            </div>
                        ))}
                    </div>

                    {/* TYPING */}
                    {typingUser && (
                        <div className="text-xs text-gray-400 px-3 pb-1">
                            ✍️ {typingUser} écrit...
                        </div>
                    )}

                    {/* INPUT */}
                    <div className="flex p-2 gap-2">
                        <input
                            className="flex-1 p-2 rounded bg-[#13263d] text-white outline-none"
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                handleTyping();
                            }}
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