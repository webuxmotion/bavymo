// store/useStreamsStore.ts
import { create } from "zustand";

type StreamsStore = {
    // Screen sharing
    screenSharingStream: MediaStream | null;
    setScreenSharingStream: (stream: MediaStream | null) => void;

    screenSharingActive: boolean;
    setScreenSharingActive: (active: boolean) => void;

    // Local stream (e.g. camera/mic)
    localStream: MediaStream | null;
    setLocalStream: (stream: MediaStream | null) => void;

    // Audio toggle
    localAudioActive: boolean;
    setLocalAudioActive: (active: boolean) => void;
};

export const useStreamsStore = create<StreamsStore>((set) => ({
    // Screen sharing
    screenSharingStream: null,
    setScreenSharingStream: (stream) => set({ screenSharingStream: stream }),

    screenSharingActive: false,
    setScreenSharingActive: (active) => set({ screenSharingActive: active }),

    // Local stream
    localStream: null,
    setLocalStream: (stream) => set({ localStream: stream }),

    // Audio toggle
    localAudioActive: true,
    setLocalAudioActive: (active) => set({ localAudioActive: active }),
}));