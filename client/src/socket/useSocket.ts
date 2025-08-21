import { useContext } from "react";
import type { SocketContextType } from "./socket-context";
import { SocketContext } from "./socket-context";

export function useSocket(): SocketContextType {
    return useContext(SocketContext);
}