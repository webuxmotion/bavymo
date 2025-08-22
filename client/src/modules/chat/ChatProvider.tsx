import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useSocket } from "../socket/useSocket"; // adjust path if needed
import { ChatContext } from "./chat-context";

export function ChatProvider({ children }: { children: ReactNode }) {
    const { socket } = useSocket();
    const [messages, setMessages] = useState<string[]>([]);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const initMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
            } catch (err) {
                console.error("Failed to access media devices:", err);
            }
        };
        initMedia();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg: string) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("message", handleMessage);

        return () => {
            socket.off("message", handleMessage);
        };
    }, [socket]);

    const sendMessage = (msg: string) => {
        if (socket && socket.connected) {
            socket.emit("message", msg);
            setMessages((prev) => [...prev, `Me: ${msg}`]);
        }
    };

    return (
        <ChatContext.Provider value={{ messages, sendMessage, localStream }}>
            {children}
        </ChatContext.Provider>
    );
}