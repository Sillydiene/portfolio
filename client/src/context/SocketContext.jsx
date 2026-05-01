import { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

    // ⚠️ IMPORTANT : protéger le build
    if (typeof window === 'undefined') return

    const socketInstance = io(BACKEND_URL, {
      transports: ['websocket'],
    })

    socketInstance.on('connect', () => {
      setConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setConnected(false)
    })

    setSocket(socketInstance)

    return () => socketInstance.close()
  }, [])

  return (
      <SocketContext.Provider value={{ socket, connected }}>
        {children}
      </SocketContext.Provider>
  )
}