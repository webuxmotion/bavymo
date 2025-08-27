import { initCallListeners } from "@/features/call/socket-listeners";
import { SocketContext } from "@/providers/socket-context";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppContext } from "./AppProvider";
import { useUsersStore } from "@/store/useUsersStore";
import { closePeerConnectionAndResetStore } from "@/utils/closePeerConnectionAndResetStore";

export interface ServerData {
    users: string[];
    // додай інші поля, які приходять з сервера
}

const SERVER_URL =
    process.env.NODE_ENV === 'production' ? 'https://bavymo.com' : 'http://localhost:4000';

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { setUser, callSetters } = useAppContext();

    const [randomId, setRandomId] = useState<string | null>(null);
    const [serverData, setServerData] = useState<ServerData>({ users: [] });

    const setUsers = useUsersStore((state) => state.setUsers);

    useEffect(() => {
        let newSocket: Socket | null = null;

        const setupSocket = async () => {
            const res = await fetch(`${SERVER_URL}/api/get-random-id`, { credentials: 'include' });
            const data = await res.json();
            setRandomId(data.randomId);

            const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
            newSocket = io(SOCKET_URL);

            setSocket(newSocket);

            newSocket.on("connect", () => {
                console.log("✅ Connected:", newSocket?.id);
            });

            newSocket.on('setRandomId', (id: string) => setRandomId(id));
            newSocket.on('serverData', (data: ServerData) => setServerData(data));

            newSocket.on("personal-code", (data) => {
                setUser({
                    personalCode: data
                });
            });

            newSocket.on("online-users", (data) => {
                setUsers(data);
            });

            initCallListeners({
                socket: newSocket,
                callSetters,
            });

            newSocket.on("user-hanged-up", () => {
                closePeerConnectionAndResetStore({ callSetters });
            });

            newSocket.on("disconnect", () => {
                console.log("❌ Disconnected");
            });
        }

        setupSocket();

        return () => {
            newSocket?.disconnect();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SocketContext.Provider value={{ socket, randomId, serverData }}>
            {children}
        </SocketContext.Provider>
    );
}