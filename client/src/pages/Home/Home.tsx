import styles from './Home.module.scss';
import LogoBig from "../../icons/LogoBig";
import Waves from "../../components/Waves";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.logo}>
                    <LogoBig />
                </div>
                <div>
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