// store/usePeerConnectionStore.ts
import { create } from "zustand";

type PeerConnectionStore = {
    peerConnection: RTCPeerConnection | null;
    setPeerConnection: (pc: RTCPeerConnection | null) => void;
};

export const usePeerConnectionStore = create<PeerConnectionStore>((set) => ({
    peerConnection: null,
    setPeerConnection: (pc) => set({ peerConnection: pc }),
}));