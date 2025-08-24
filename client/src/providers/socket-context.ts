import type { OnlineUser } from "@server/shared/types";
import { createContext } from "react";
import { Socket } from "socket.io-client";
import type { ServerData } from "./SocketProvider";

export type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: OnlineUser[]; // ✅ array of OnlineUser
  randomId: string | null;
  serverData: ServerData;
};

// Create context with default values
export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: [],
  randomId: null,
  serverData: { users: [] }
});