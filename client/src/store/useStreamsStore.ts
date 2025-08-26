// store/useStreamsStore.ts
import { create } from "zustand";

type StreamsStore = {
    screenSharingStream: MediaStream | null;
    setScreenSharingStream: (stream: MediaStream | null) => void;

    screenSharingActive: boolean;
    setScreenSharingActive: (active: boolean) => void;
};

export const useStreamsStore = create<StreamsStore>((set) => ({
    screenSharingStream: null,
    setScreenSharingStream: (stream) => set({ screenSharingStream: stream }),

    screenSharingActive: false,
    setScreenSharingActive: (active) => set({ screenSharingActive: active }),
}));