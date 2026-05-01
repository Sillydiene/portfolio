import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, MessageCircle, Trash2, ArrowLeft, Clock, Globe, Hash } from 'lucide-react';

const SERVER_URL =
    import.meta.env.VITE_CHAT_SERVER_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    'http://localhost:3001';

function Avatar({ name, size = 'md' }) {
    const initials =
        name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'V';

    const colors = [
        'from-violet-500 to-purple-600',
        'from-amber-400 to-orange-500',
        'from-emerald-400 to-teal-500',
        'from-rose-400 to-pink-500',
        'from-sky-400 to-blue-500',
    ];

    const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
    const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

    return (
        <div className={`${sz} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-semibold`}>
            {initials}
        </div>
    );
}

function StatusDot({ active }) {
    return (
        <span className="relative flex h-2.5 w-2.5">
      {active && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      )}
            <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    active ? 'bg-emerald-500' : 'bg-zinc-400'
                }`}
            />
    </span>
    );
}

export default function Admin() {
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [connected, setConnected] = useState(false);
    const [typing, setTyping] = useState(false);

    const bottomRef = useRef(null);
    const typingTimeout = useRef(null);
    const socketRef = useRef(null);
    const inputRef = useRef(null);

    // ✅ FIX VERCEL (IMPORT DYNAMIQUE)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let socketInstance;

        import('socket.io-client').then(({ io }) => {
            socketInstance = io(SERVER_URL, {
                transports: ['websocket'],
            });

            socketRef.current = socketInstance;

            socketInstance.on('connect', () => setConnected(true));
            socketInstance.on('disconnect', () => setConnected(false));
            socketInstance.on('rooms-updated', (r) => setRooms(r));
            socketInstance.on('history', (h) => setMessages(h || []));
            socketInstance.on('message', (msg) =>
                setMessages((prev) => [...prev, msg])
            );

            socketInstance.on('typing', (data) => {
                if (data.sender === 'visitor') {
                    setTyping(true);
                    clearTimeout(typingTimeout.current);
                    typingTimeout.current = setTimeout(() => setTyping(false), 2000);
                }
            });

            fetch(`${SERVER_URL}/api/live-chat/rooms`)
                .then((r) => r.json())
                .then((data) => setRooms(data.rooms || []))
                .catch(() => {});
        });

        return () => {
            socketInstance?.disconnect();
        };
    }, []);

    const joinRoom = (room) => {
        setActiveRoom(room);
        setMessages([]);
        socketRef.current?.emit('join-room', {
            roomId: room.roomId,
            role: 'admin',
        });
    };

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current || !activeRoom) return;

        socketRef.current.emit('message', {
            roomId: activeRoom.roomId,
            text: input.trim(),
            sender: 'admin',
        });

        setInput('');
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (t) =>
        new Date(t).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
            {/* HEADER */}
            <div className="p-4 border-b border-white/10 flex justify-between">
                <h1 className="font-bold">Admin Chat</h1>
                <div className="flex items-center gap-2 text-sm">
                    <StatusDot active={connected} />
                    {connected ? 'Connecté' : 'Offline'}
                </div>
            </div>

            <div className="flex flex-1">
                {/* ROOMS */}
                <div className="w-64 border-r border-white/10 p-3 space-y-2">
                    {rooms.map((room) => (
                        <button
                            key={room.roomId}
                            onClick={() => joinRoom(room)}
                            className="w-full text-left p-2 bg-white/5 rounded hover:bg-white/10"
                        >
                            {room.visitorName}
                        </button>
                    ))}
                </div>

                {/* CHAT */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className="text-sm">
                                <b>{msg.sender}</b>: {msg.text}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* INPUT */}
                    <div className="p-3 border-t border-white/10 flex gap-2">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-white/10 p-2 rounded"
                            placeholder="Message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-amber-500 px-4 rounded text-black"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}