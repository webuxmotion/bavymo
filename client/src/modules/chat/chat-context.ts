import { createContext } from "react";

export type ChatContextType = {
    messages: string[];
    sendMessage: (msg: string) => void;
    localStream: MediaStream | null;
};

// Create context with default values
export const ChatContext = createContext<ChatContextType>({
    messages: [],
    sendMessage: () => { },
    localStream: null,
});