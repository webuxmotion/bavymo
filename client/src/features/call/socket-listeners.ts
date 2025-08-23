import type { Socket } from "socket.io-client";
import type { CallSetters } from "./callTypes";

const configuration: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        {
            urls: [
                'stun:185.233.47.117:3478',
                'turn:185.233.47.117:3478?transport=udp',
                'turn:185.233.47.117:3478?transport=tcp'
            ],
            username: "webrtcuser@bavymo.com",
            credential: 'strongpassword'
        }
    ],
    iceTransportPolicy: "all"
};

type CreatePeerConnectionArgs = {
    callee: string; // personalCode or socketId of the callee
    localStream: MediaStream;
    socket: Socket;
    setRemoteStream: (stream: MediaStream) => void;
};

const createPeerConnection = async ({ callee, localStream, socket, setRemoteStream }: CreatePeerConnectionArgs) => {
    const pc = new RTCPeerConnection(configuration);

    localStream.getTracks().forEach(track => pc!.addTrack(track, localStream));
    pc.ontrack = (event) => setRemoteStream(event.streams[0]);
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('signal', { to: callee, data: { candidate: event.candidate } });
        }
    };

    return pc;
}

export function initCallListeners({
    socket,
    callSetters,
    getLocalStream,
    setRemoteStream,
}: {
    socket: Socket;
    callSetters: CallSetters;
    getLocalStream: () => MediaStream | null;
    setRemoteStream: (stream: MediaStream | null) => void
}) {
    let pc: RTCPeerConnection | null = null;

    socket.on("call-accept", async ({ callee, caller }) => {
        const localStream = getLocalStream();

        if (!localStream) {
            console.warn("No local stream available on call-accept");
            return;
        }

        callSetters.setOutgoing(false);

        pc = await createPeerConnection({ callee, localStream, socket, setRemoteStream });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("offer", {
            callee,
            caller,
            sdp: offer,
        });
    });

    socket.on("offer", async ({ caller, callee, sdp }) => {
        const localStream = getLocalStream();

        if (!localStream) {
            console.warn("No local stream available on offer");
            return;
        }

        pc = await createPeerConnection({ callee, localStream, socket, setRemoteStream });

        await pc.setRemoteDescription(new RTCSessionDescription(sdp));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
            caller,
            callee,
            sdp: answer,
        });
    });

    socket.on("answer", async ({ sdp }) => {

        if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        }
    });

    socket.on("signal", async ({ data: { candidate } }) => {
        if (pc) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
    });

    socket.on("call-rejected", () => {

    });

    socket.on("call", ({ callerUser }) => {
        callSetters.setIncoming(true);
        callSetters.setCallerId(callerUser.personalCode);
        callSetters.setCallStatus("ringing");
    });

    socket.on("cancel-call", () => {

    });
}