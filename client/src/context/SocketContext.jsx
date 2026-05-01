import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // ✅ URL dynamique (prod + dev)
    const BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    console.log('Connecting to:', BACKEND_URL);

    const socketInstance = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      console.log('✅ Connected to server:', socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
      setConnected(false);
      console.log('❌ Disconnected:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('🚨 Connection error:', error.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
      <SocketContext.Provider value={{ socket, connected }}>
        {children}
      </SocketContext.Provider>
  );
};