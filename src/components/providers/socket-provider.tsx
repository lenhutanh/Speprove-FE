'use client'

import envConfig from '@/envConfig'
import { useGenerateSocketTicketMutation } from '@/queries'
import { useAuthStore } from '@/store'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const { isAuthenticated } = useAuthStore()
  const { mutateAsync: getSocketTicket } = useGenerateSocketTicketMutation()

  useEffect(() => {
    let active = true
    let socketInstance: Socket | null = null

    const initSocket = async () => {
      if (!isAuthenticated) {
        setSocket(null)
        setIsConnected(false)
        return
      }

      try {
        const data = await getSocketTicket()

        if (!active) return

        const ticket = data.data.ticket
        socketInstance = io(envConfig.NEXT_PUBLIC_BACKEND_API_URL || '', {
          auth: { ticket },
          transports: ['websocket'],
        })

        socketInstance.on('connect', () => {
          socketInstance?.emit('ping', {
            time: Date.now(),
          })

          if (active) setIsConnected(true)
        })

        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error.message)
        })

        socketInstance.on('pong', (data) => {
          console.log('Server replied', data)
        })

        socketInstance.on('disconnect', () => {
          if (active) setIsConnected(false)
        })

        if (active) setSocket(socketInstance)
      } catch (error) {
        console.error('Lỗi khi lấy ticket hoặc kết nối socket:', error)
      }
    }

    initSocket()

    return () => {
      active = false
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [isAuthenticated, getSocketTicket])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
