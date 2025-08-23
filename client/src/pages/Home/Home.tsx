import styles from './Home.module.scss';
import LogoBig from "@/icons/LogoBig";
import Waves from "@/components/Waves";
import { Link } from "react-router-dom";
import { useEffect, useRef } from 'react';
import { useChat } from '@/modules/chat/useChat';

function Home() {
    const { localStream } = useChat();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoRef.current && localStream) {
            videoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.logo}>
                    <LogoBig />
                </div>
                <div className='flex items-center mt-15'>
                    <div className={styles.videoPreview}>
                        <video
                            className={styles.video}
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                        />
                    </div>
                    <Link to="/video-chat" className={styles.heroButton}>Go to Video Chat</Link>
                </div>
                <h1>Bavymo - video chat with games</h1>
            </div>

            <div className={styles.waves}>
                <Waves />
            </div>
        </div>
    );
}

export default Home;