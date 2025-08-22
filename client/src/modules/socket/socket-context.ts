import { createContext } from "react";
import { Socket } from "socket.io-client";
import type { OnlineUser } from '../../../../server/src/store';

export type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  personalCode: string;
  onlineUsers: OnlineUser[]; // ✅ array of OnlineUser
};

// Create context with default values
export const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    personalCode: '',
    onlineUsers: [],
});