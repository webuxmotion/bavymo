import { createContext } from "react";
import { Socket } from "socket.io-client";

export type SocketContextType = {
    socket: Socket | null;
    isConnected: boolean;
    personalCode: string;
};

// Create context with default values
export const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    personalCode: '',
});