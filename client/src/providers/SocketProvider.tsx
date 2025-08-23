import { initCallListeners } from "@/features/call/socket-listeners";
import { SocketContext } from "@/providers/socket-context";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppContext } from "./AppProvider";

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { setRemoteStream, setUser, callSetters, data: { localStream } } = useAppContext();
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => { localStreamRef.current = localStream }, [localStream]);

    useEffect(() => {
        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
        const newSocket = io(SOCKET_URL);

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("✅ Connected:", newSocket.id);
            setIsConnected(true);
        });

        newSocket.on("personal-code", (data) => {
            setUser({
                personalCode: data
            });
        });

        newSocket.on("online-users", (data) => {
            setOnlineUsers(data);
        });

        initCallListeners({
            socket: newSocket,
            callSetters,
            getLocalStream: () => localStreamRef.current,
            setRemoteStream,
        });

        newSocket.on("disconnect", () => {
            console.log("❌ Disconnected");
            setIsConnected(false);
        });

        return () => {
            newSocket.disconnect();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
            {children}
            {socket?.id}
        </SocketContext.Provider>
    );
}