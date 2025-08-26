import { create } from "zustand";

type StreamsStore = {
    screenSharingStream: MediaStream | null;
    setScreenSharingStream: (stream: MediaStream | null) => void;

    screenSharingActive: boolean;
    setScreenSharingActive: (active: boolean) => void;

    localStream: MediaStream | null;
    setLocalStream: (stream: MediaStream | null) => void;

    localAudioActive: boolean;
    setLocalAudioActive: (active: boolean) => void;

    remoteStream: MediaStream | null;
    setRemoteStream: (stream: MediaStream | null) => void;
};

export const useStreamsStore = create<StreamsStore>((set) => ({
    screenSharingStream: null,
    setScreenSharingStream: (stream) => set({ screenSharingStream: stream }),

    screenSharingActive: false,
    setScreenSharingActive: (active) => set({ screenSharingActive: active }),

    localStream: null,
    setLocalStream: (stream) => set({ localStream: stream }),

    localAudioActive: true,
    setLocalAudioActive: (active) => set({ localAudioActive: active }),

    remoteStream: null,
    setRemoteStream: (stream) => set({ remoteStream: stream }),
}));