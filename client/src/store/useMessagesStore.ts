import type { Message } from "@server/shared/types";
import { create } from "zustand";

type MessagesStore = {
    messages: Message[];
    addMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
    clearMessages: () => void;
    removeMessage: (id: string) => void;
};

export const useMessagesStore = create<MessagesStore>((set) => ({
    messages: [],

    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),

    setMessages: (messages) => set({ messages }),

    clearMessages: () => set({ messages: [] }),

    removeMessage: (id) =>
        set((state) => ({
            messages: state.messages.filter((msg) => msg.id !== id),
        })),
}));