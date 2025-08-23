import { useCallback, useEffect, useRef, useState } from 'react';
import { configuration } from './configuration';
import type { Socket } from 'socket.io-client';

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
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
};

export function useWebRTC(socket: Socket | null): UseWebRTCReturn {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    const pcRef = useRef<RTCPeerConnection | null>(null);
    const iceCandidateQueue = useRef<RTCIceCandidate[]>([]);

    const createPeerConnection = useCallback(
        async (calleeRandomId: string) => {
            pcRef.current = new RTCPeerConnection(configuration);

            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            stream?.getTracks().forEach(track => pcRef.current!.addTrack(track, stream));

            pcRef.current.ontrack = (event) => {
                console.log('set remote stream');
                setRemoteStream(event.streams[0]);
            };

            pcRef.current.onicecandidate = (event) => {
                if (event.candidate && socket) {
                    socket.emit('signal', { to: calleeRandomId, data: { candidate: event.candidate } });
                }
            };
        },
        [socket]
    );

    const startCall = async (calleeRandomId: string) => {
        await createPeerConnection(calleeRandomId);

        if (!pcRef.current) return;

        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);

        console.log('i send offer');
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

                    console.log('i send answer');
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

    return { startCall, localStream, remoteStream };
}