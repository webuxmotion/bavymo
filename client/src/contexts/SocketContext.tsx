// src/contexts/SocketContext.tsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// --- Типи ---
interface ServerData {
  users: string[];
  // додай інші поля, які приходять з сервера
}

interface SocketContextType {
  socket: Socket | null;
  randomId: string | null;
  serverData: ServerData | null;
}

interface IoProviderProps {
  children: ReactNode;
}

// --- Context ---
const SocketContext = createContext<SocketContextType | null>(null);

// --- URL сервера ---
const SERVER_URL =
  process.env.NODE_ENV === 'production' ? 'https://www.kazuar.com.ua' : 'http://localhost:4000';

// --- Провайдер ---
export const IoProvider = ({ children }: IoProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [randomId, setRandomId] = useState<string | null>(null);
  const [serverData, setServerData] = useState<ServerData | null>(null);


  useEffect(() => {
    let socketIo: Socket | null = null;

    const setupSocket = async () => {
      const res = await fetch(`${SERVER_URL}/api/get-random-id`, { credentials: 'include' });
      const data = await res.json();
      setRandomId(data.randomId);

      socketIo = io(SERVER_URL, { withCredentials: true });

      socketIo.on('connect', () => setSocket(socketIo));
      socketIo.on('setRandomId', (id: string) => setRandomId(id));
      socketIo.on('serverData', (data: ServerData) => setServerData(data));
      socketIo.on('disconnect', () => { /* можна додати логіку */ });
    };

    setupSocket();

    return () => {
      socket?.disconnect(); // очищення при unmount
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={{ socket, randomId, serverData }}>
      {children}
    </SocketContext.Provider>
  );
};

// --- Хук для використання ---
export const useSocket = (): SocketContextType | null => useContext(SocketContext);