import { useContext } from "react";
import { SocketContext, type SocketContextType } from "./socket-context";

export function useSocket(): SocketContextType {
    return useContext(SocketContext);
}