import { useStreamsStore } from '@/store/useStreamsStore';
import { useCallback, useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import { usePeerConnectionStore } from '../store/usePeerConnectionStore';
import { configuration } from './configuration';

type SignalData = {
    sdp?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
};

type SignalEvent = {
    from: string;
    data: SignalData;
};

type UseWebRTCReturn = {
    startCall: (calleeRandomId: string) => Promise<void>;
};

export function useWebRTC(socket: Socket | null): UseWebRTCReturn {
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const iceCandidateQueue = useRef<RTCIceCandidate[]>([]);
    const setPeerConnection = usePeerConnectionStore(s => s.setPeerConnection);
    const setPcRef = usePeerConnectionStore(s => s.setPcRef);
    const { setLocalStream, setRemoteStream } = useStreamsStore(state => state);

    setPcRef(pcRef);

    const createPeerConnection = useCallback(
        async (calleeRandomId: string) => {
            pcRef.current = new RTCPeerConnection(configuration);

            setPeerConnection(pcRef.current);

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            stream?.getTracks().forEach(track => pcRef.current!.addTrack(track, stream));

            pcRef.current.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
            };

            pcRef.current.onicecandidate = (event) => {
                if (event.candidate && socket) {
                    socket.emit('signal', { to: calleeRandomId, data: { candidate: event.candidate } });
                }
            };

            pcRef.current.onconnectionstatechange = () => {
                if (pcRef.current?.connectionState === "connected" && socket) {
                    console.log("Peer connection established!");
                    socket.emit("webrtc-connected");
                }
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [socket]
    );

    const startCall = async (calleeRandomId: string) => {
        await createPeerConnection(calleeRandomId);

        if (!pcRef.current) return;

        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);

        socket?.emit('signal', { to: calleeRandomId, data: { sdp: offer } });
    };

    useEffect(() => {
        if (!socket) return;

        const handleSignal = async ({ from, data }: SignalEvent) => {
            if (!pcRef.current) {
                await createPeerConnection(from);
            }

            if (!pcRef.current) return;

            if (data.sdp) {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.sdp));

                iceCandidateQueue.current.forEach(candidate => pcRef.current?.addIceCandidate(candidate));
                iceCandidateQueue.current = [];

                if (data.sdp.type === 'offer') {
                    const answer = await pcRef.current.createAnswer();
                    await pcRef.current.setLocalDescription(answer);

                    socket.emit('signal', { to: from, data: { sdp: answer } });
                }
            }

            if (data.candidate) {
                const candidate = new RTCIceCandidate(data.candidate);
                if (pcRef.current.remoteDescription) {
                    await pcRef.current.addIceCandidate(candidate);
                } else {
                    iceCandidateQueue.current.push(candidate);
                }
            }
        };

        socket.on('signal', handleSignal);

        // ✅ Always return a proper cleanup function
        return () => {
            socket.off('signal', handleSignal);
        };
    }, [socket, createPeerConnection]);

    return { startCall };
}