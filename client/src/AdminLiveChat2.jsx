import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, MessageCircle, Wifi, WifiOff, Trash2 } from 'lucide-react';

// ─── Même URL que dans LiveChat.jsx ───────────────────────────
const SERVER_URL = 'http://localhost:3001';
// ─────────────────────────────────────────────────────────────

export default function Admin() {
    const [messages, setMessages]   = useState([]);
    const [input, setInput]         = useState('');
    const [socket, setSocket]       = useState(null);
    const [connected, setConnected] = useState(false);
    const [visitors, setVisitors]   = useState(0);
    const [typing, setTyping]       = useState(false);
    const bottomRef = useRef(null);
    const typingTimeout = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
        script.async = true;
        script.onload = () => {
            const s = window.io(SERVER_URL, { transports: ['websocket'] });
            setSocket(s);

            s.on('connect', () => setConnected(true));
            s.on('disconnect', () => setConnected(false));
            s.on('history', (h) => setMessages(h));
            s.on('message', (msg) => setMessages((prev) => [...prev, msg]));
            s.on('visitors', (count) => setVisitors(count));
            s.on('typing', (data) => {
                if (data.sender === 'visitor') {
                    setTyping(true);
                    clearTimeout(typingTimeout.current);
                    typingTimeout.current = setTimeout(() => setTyping(false), 2000);
                }
            });
        };
        document.head.appendChild(script);
        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !socket || !connected) return;
        socket.emit('message', { text: input.trim(), sender: 'admin' });
        setInput('');
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const clearMessages = () => setMessages([]);

    const visitorMsgs = messages.filter((m) => m.sender === 'visitor').length;
    const adminMsgs   = messages.filter((m) => m.sender === 'admin').length;

    return (
        <div className="min-h-screen bg-background font-inter flex flex-col">
            {/* Top bar */}
            <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="font-playfair text-lg font-bold text-foreground">Interface Admin — Chat</h1>
                        <p className="text-xs text-muted-foreground font-inter">Répondez aux visiteurs en temps réel</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-inter">
                        {connected
                            ? <><Wifi className="w-4 h-4 text-green-500" /><span className="text-green-500">Connecté</span></>
                            : <><WifiOff className="w-4 h-4 text-destructive" /><span className="text-destructive">Hors ligne</span></>
                        }
                    </div>
                    <div className="flex items-center gap-2 text-sm font-inter text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{visitors} visiteur{visitors > 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar stats */}
                <div className="w-64 border-r border-border bg-card p-5 hidden md:flex flex-col gap-4">
                    <h2 className="text-xs font-inter font-semibold text-muted-foreground uppercase tracking-widest">Statistiques</h2>
                    {[
                        { label: 'Total messages', value: messages.length, color: 'text-foreground' },
                        { label: 'Messages visiteurs', value: visitorMsgs, color: 'text-primary' },
                        { label: 'Vos réponses', value: adminMsgs, color: 'text-green-500' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-background rounded-xl p-4 border border-border">
                            <div className={`text-2xl font-playfair font-bold ${color}`}>{value}</div>
                            <div className="text-xs text-muted-foreground font-inter mt-1">{label}</div>
                        </div>
                    ))}

                    <button
                        onClick={clearMessages}
                        className="mt-auto flex items-center gap-2 text-sm text-destructive font-inter hover:bg-destructive/10 rounded-xl px-3 py-2 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Effacer l'affichage
                    </button>
                </div>

                {/* Chat principal */}
                <div className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                                <MessageCircle className="w-12 h-12 opacity-20" />
                                <p className="font-inter text-sm">Aucun message pour le moment.</p>
                                <p className="font-inter text-xs">Les messages des visiteurs apparaîtront ici.</p>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="max-w-[60%]">
                                    <div className={`text-xs font-inter mb-1 ${msg.sender === 'admin' ? 'text-right text-primary' : 'text-muted-foreground'}`}>
                                        {msg.sender === 'admin' ? 'Vous' : 'Visiteur'} · {new Date(msg.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className={`px-4 py-2.5 rounded-2xl text-sm font-inter ${
                                        msg.sender === 'admin'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-card border border-border text-foreground rounded-bl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <AnimatePresence>
                            {typing && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-card border border-border px-4 py-2.5 rounded-2xl rounded-bl-none flex gap-1 items-center">
                                        {[0, 1, 2].map((i) => (
                                            <span key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-border p-4 bg-card">
                        {!connected && (
                            <p className="text-xs text-destructive font-inter mb-2 text-center">
                                ⚠️ Serveur non connecté — lancez <code className="bg-secondary px-1 rounded">npm run dev</code> dans <code className="bg-secondary px-1 rounded">chat-server/</code>
                            </p>
                        )}
                        <div className="flex gap-3">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Répondre au visiteur…"
                                disabled={!connected}
                                className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-inter text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 disabled:opacity-50 transition-colors"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || !connected}
                                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-inter font-medium flex items-center gap-2 hover:bg-primary/90 disabled:opacity-40 transition-all"
                            >
                                <Send className="w-4 h-4" />
                                Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}