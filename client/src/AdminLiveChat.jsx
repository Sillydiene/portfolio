import React, { useState, useEffect, useRef } from 'react';

const SERVER_URL =
    import.meta.env.VITE_CHAT_SERVER_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    'http://localhost:3001';

export default function AdminLiveChat() {
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [connected, setConnected] = useState(false);

    const socketRef = useRef(null);
    const bottomRef = useRef(null);

    // ✅ SOCKET SAFE POUR VERCEL
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let socketInstance;

        (async () => {
            try {
                const { io } = await import('socket.io-client');

                socketInstance = io(SERVER_URL, {
                    transports: ['websocket'],
                });

                socketRef.current = socketInstance;

                socketInstance.on('connect', () => {
                    console.log('Connected');
                    setConnected(true);
                });

                socketInstance.on('disconnect', () => {
                    console.log('Disconnected');
                    setConnected(false);
                });

                socketInstance.on('rooms-updated', (r) => setRooms(r));
                socketInstance.on('history', (h) => setMessages(h || []));
                socketInstance.on('message', (msg) =>
                    setMessages((prev) => [...prev, msg])
                );

                // récupérer les rooms
                fetch(`${SERVER_URL}/api/live-chat/rooms`)
                    .then((r) => r.json())
                    .then((data) => setRooms(data.rooms || []))
                    .catch(() => {});
            } catch (err) {
                console.error('Socket init error:', err);
            }
        })();

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

    // scroll auto
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="min-h-screen bg-black text-white flex">

            {/* LISTE ROOMS */}
            <div className="w-64 border-r border-white/10 p-3">
                <h2 className="mb-3 font-bold">Rooms</h2>
                {rooms.map((room) => (
                    <button
                        key={room.roomId}
                        onClick={() => joinRoom(room)}
                        className="block w-full text-left p-2 mb-2 bg-white/5 rounded hover:bg-white/10"
                    >
                        {room.visitorName || room.roomId}
                    </button>
                ))}
            </div>

            {/* CHAT */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <div className="p-3 border-b border-white/10">
                    {activeRoom ? activeRoom.visitorName : 'Sélectionne une room'}
                    {' '}| {connected ? '🟢 connecté' : '🔴 offline'}
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {messages.map((msg, i) => (
                        <div key={i}>
                            <b>{msg.sender}</b>: {msg.text}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* INPUT */}
                <div className="p-3 border-t border-white/10 flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-white/10 p-2 rounded"
                        placeholder="Message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-yellow-500 px-4 rounded text-black"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}