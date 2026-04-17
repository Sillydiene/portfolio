import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

const SERVER_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost:3001';

export default function LiveChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [notifStatus, setNotifStatus] = useState('idle');

    const bottomRef = useRef(null);
    const hasNotifiedRef = useRef(false);

    // ─────────────────────────────────────────────
    useEffect(() => {
        if (!open) return;

        const generatedRoomId =
            crypto?.randomUUID?.() ||
            `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        setRoomId(generatedRoomId);

        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
        script.async = true;

        script.onload = () => {
            const s = window.io(SERVER_URL, { transports: ['websocket'] });

            setSocket(s);

            s.on('connect', () => {
                setConnected(true);
                s.emit('join-room', { roomId: generatedRoomId, role: 'visitor' });
            });

            s.on('disconnect', () => setConnected(false));
            s.on('history', (history) => setMessages(history));
            s.on('message', (msg) => setMessages((prev) => [...prev, msg]));
        };

        document.head.appendChild(script);

        return () => {
            if (socket) socket.disconnect();
            document.head.removeChild(script);
        };
    }, [open]);

    // ─────────────────────────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ─────────────────────────────────────────────
    const sendMessage = () => {
        if (!input.trim() || !socket || !connected || !roomId) return;

        // 🔔 NOTIFICATION UNIQUEMENT AU 1er MESSAGE
        if (!hasNotifiedRef.current) {
            hasNotifiedRef.current = true;
            setNotifStatus('sending');

            fetch(`${SERVER_URL}/api/live-chat/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId,
                    pageUrl: window.location.href,
                    visitorName: 'Visiteur portfolio',
                }),
            })
                .then(async (res) => {
                    const payload = await res.json().catch(() => ({}));
                    const delivered = payload?.notification?.delivered;
                    setNotifStatus(delivered ? 'sent' : 'queued');
                })
                .catch(() => setNotifStatus('failed'));
        }

        socket.emit('message', {
            roomId,
            text: input.trim(),
            sender: 'visitor'
        });

        setInput('');
    };

    // ─────────────────────────────────────────────
    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // ─────────────────────────────────────────────
    return (
        <div className="fixed bottom-6 right-24 z-50 flex flex-col items-end gap-3">

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                    >

                        {/* HEADER */}
                        <div className="bg-primary px-4 py-3 flex items-center justify-between">
                            <div>
                                <p className="text-primary-foreground font-semibold text-sm">
                                    Chat en direct
                                </p>

                                <p className="text-primary-foreground/70 text-xs">
                                    <span className={`w-2 h-2 inline-block rounded-full mr-2 ${connected ? 'bg-green-300' : 'bg-gray-300'}`} />
                                    {connected ? 'Connecté' : 'En attente...'}
                                </p>

                                <p className="text-[11px] text-primary-foreground/70 mt-1">
                                    {notifStatus === 'sending' && 'Notification en cours...'}
                                    {notifStatus === 'sent' && 'Admin notifié'}
                                    {notifStatus === 'queued' && 'Notification envoyée'}
                                    {notifStatus === 'failed' && 'Notification échouée'}
                                </p>
                            </div>

                            <button onClick={() => setOpen(false)}>
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* MESSAGES */}
                        <div className="h-72 overflow-y-auto p-4 space-y-2 bg-background">

                            {messages.length === 0 && (
                                <p className="text-center text-xs text-muted-foreground mt-8">
                                    Bonjour 👋 comment puis-je vous aider ?
                                </p>
                            )}

                            {roomId && (
                                <p className="text-center text-[11px] text-muted-foreground">
                                    Room: {roomId.slice(0, 8)}
                                </p>
                            )}

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                                        msg.sender === 'visitor'
                                            ? 'bg-primary text-white'
                                            : 'bg-secondary'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            <div ref={bottomRef} />
                        </div>

                        {/* INPUT */}
                        <div className="border-t p-3 flex gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Votre message..."
                                className="flex-1 px-3 py-2 rounded-xl bg-secondary text-sm"
                            />

                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || !connected}
                                className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* BUTTON */}
            <motion.button
                onClick={() => setOpen(v => !v)}
                className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {open ? <X /> : <MessageCircle />}
            </motion.button>

        </div>
    );
}