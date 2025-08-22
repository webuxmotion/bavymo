import { useContext } from "react";
import type { ChatContextType } from "./chat-context";
import { ChatContext } from "./chat-context";

export function useChat(): ChatContextType {
    return useContext(ChatContext);
}