// usePeerConnectionStore.ts
import { create } from "zustand";

type PeerConnectionStore = {
    peerConnection: RTCPeerConnection | null;
    setPeerConnection: (pc: RTCPeerConnection | null) => void;

    pcRef: React.RefObject<RTCPeerConnection | null> | null;
    setPcRef: (ref: React.RefObject<RTCPeerConnection | null>) => void;
};

export const usePeerConnectionStore = create<PeerConnectionStore>((set) => ({
    peerConnection: null,
    setPeerConnection: (pc) => set({ peerConnection: pc }),

    pcRef: null,
    setPcRef: (ref) => set({ pcRef: ref }),
}));