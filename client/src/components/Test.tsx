// src/components/Layout.tsx
import { Link } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useEffect, useRef, useState } from 'react';
import { useWebRTC } from '../hooks/userWebRTC';
import type { Socket } from 'socket.io-client';

type ServerData = {
    users?: string[];
};

type SocketContextType = {
    socket: Socket | null;
    randomId: string | null;
    serverData: ServerData | null;
};

export default function Test() {
    const socketContext = useSocket() as unknown as SocketContextType;
    const socket = socketContext?.socket ?? null;
    const randomId = socketContext?.randomId ?? null;
    const serverData = socketContext?.serverData ?? null;

    const { startCall, remoteStream, localStream } = useWebRTC(socket);

    const [users, setUsers] = useState<string[]>([]);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    useEffect(() => {
        const newUsers = serverData?.users?.filter(el => el !== randomId) || [];
        setUsers(newUsers);
    }, [serverData, randomId]);

    return (
        <header style={{ padding: 20, borderBottom: '1px solid #ccc' }}>
            <h1>My App.</h1>
            <p>Socket id: {socket?.id}</p>
            <p>random id: {randomId}</p>

            {users.length ? (
                <>
                    {users.map(u => (
                        <div key={u}>
                            <span>{u}</span>
                            <button onClick={() => startCall(u)}>Call</button>
                        </div>
                    ))}
                </>
            ) : null}

            <div>
                <h3>Local</h3>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: 200 }}
                />
            </div>

            <div>
                <h3>Remote</h3>
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{ width: 200 }}
                />
            </div>

            <nav>
                <Link to="/" style={{ marginRight: 10 }}>Home</Link>
                <Link to="/chat">Chat</Link>
            </nav>
        </header>
    );
}