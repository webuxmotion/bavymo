import type { createCallSetters } from "@/features/call/call-setters";
import { usePeerConnectionStore } from "@/store/usePeerConnectionStore"
import { useStreamsStore } from "@/store/useStreamsStore";

export const closePeerConnectionAndResetStore = ({ callSetters }: { callSetters: ReturnType<typeof createCallSetters> }) => {
    const { peerConnection, setPeerConnection, pcRef } = usePeerConnectionStore.getState();
    const { setRemoteStream } = useStreamsStore.getState();

    if (peerConnection) {
        peerConnection.close();
        setPeerConnection(null);
        if (pcRef) pcRef.current = null; // ✅ clears the ref too
        setRemoteStream(null);
        callSetters.resetCall();
    }
}

