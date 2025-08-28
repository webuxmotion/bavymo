import { useWebRTC } from "@/hooks/useWebRTC";
import { useAppContext } from "@/providers/AppProvider";
import { useMessagesStore } from "@/store/useMessagesStore";
import { useRoomStore } from "@/store/useRoomStore";
import { useUsersStore } from "@/store/useUsersStore";
import { closePeerConnectionAndResetStore } from "@/utils/closePeerConnectionAndResetStore";
import type { Room } from "@server/shared/types";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "./socket-context";

export interface ServerData {
    users: string[];
    // додай інші поля, які приходять з сервера
}

const SERVER_URL =
    process.env.NODE_ENV === 'production' ? 'https://bavymo.com' : 'http://localhost:4000';

export function SocketProvider({ children }: { children: ReactNode }) {
    const socket = useRef<Socket | null>(null);
    const { setUser, user } = useAppContext();
    const { startCall } = useWebRTC(socket.current);

    const [randomId, setRandomId] = useState<string | null>(null);
    const [serverData, setServerData] = useState<ServerData>({ users: [] });

    const setUsers = useUsersStore((state) => state.setUsers);
    const setRoom = useRoomStore((state) => state.setRoom);
    const setMessages = useMessagesStore((state) => state.setMessages);

    useEffect(() => {
        let newSocket: Socket | null = null;

        const setupSocket = async () => {
            const res = await fetch(`${SERVER_URL}/api/get-random-id`, { credentials: 'include' });
            const data = await res.json();
            setRandomId(data.randomId);

            const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
            newSocket = io(SOCKET_URL);
            socket.current = newSocket;

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

            newSocket.on("messages", (messages) => {
                setMessages(messages);
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


    useEffect(() => {
        if (user.personalCode) {

            const basedOnUserHandlers = async () => {
                socket.current?.on("room", (room: Room) => {
                    setRoom(room);

                    if (room.callStatus === "accepted" && user.personalCode === room.callerId) {
                        // just caller initiate peerConnection
                        startCall(room.calleeId);
                    } else if (room.callStatus === "ended") {
                        closePeerConnectionAndResetStore();
                        setMessages([]);
                    } else if (room.callStatus === "rejected") {
                        // rejected logic
                    } else if (room.callStatus === "cancelled") {
                        // cancelled logic
                    }
                });
            }

            basedOnUserHandlers();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.personalCode]);

    return (
        <SocketContext.Provider value={{ socket: socket.current, randomId, serverData }}>
            {children}
        </SocketContext.Provider>
    );
}