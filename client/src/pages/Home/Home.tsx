import { Link } from "react-router-dom";
import LogoBig from "@/icons/LogoBig";
import Waves from "@/components/Waves";
import styles from './Home.module.scss';
import { useLocalVideoRef } from "@/hooks/useLocalVideoRef";

function Home() {
    const videoRef = useLocalVideoRef();

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