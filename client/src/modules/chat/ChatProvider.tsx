import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useSocket } from "../socket/useSocket"; // adjust path if needed
import { ChatContext } from "./chat-context";
import CallModal from "../../components/CallModal/CallModal";
import type { OnlineUser } from "../../../../server/src/store";

export function ChatProvider({ children }: { children: ReactNode }) {
    const { socket } = useSocket();
    const [messages, setMessages] = useState<string[]>([]);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [incoming, setIncoming] = useState(false);
    const [callerUser, setCallerUser] = useState<OnlineUser | null>(null);

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

        socket.on("call", ({ callerUser }) => {
            setCallerUser(callerUser);
            setIncoming(true);
        });

        socket.on("cancel-call", () => {
            setCallerUser(null);
            setIncoming(false);
        });

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

    const handleAccept = () => {
        if (socket && callerUser) {
            socket.emit("call-accept", { callerUser });
        }

        setIncoming(false);
    }

    const handleReject = () => {
        if (socket && callerUser) {
            socket.emit("call-reject", { callerUser });
        }

        setIncoming(false);
    }

    return (
        <ChatContext.Provider value={{ messages, sendMessage, localStream }}>
            {children}

            {callerUser && (
                <CallModal
                    onClose={() => { }}
                    open={incoming}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    type="incoming"
                    callerName={callerUser.personalCode}
                />
            )}
        </ChatContext.Provider>
    );
}