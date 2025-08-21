import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import styles from "./VideoChat.module.scss";
import LogoBig from "../../icons/LogoBig";

function VideoChat() {
    const location = useLocation();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (location.pathname === "/video-chat") {
            // trigger after mount so transition works
            setTimeout(() => setIsActive(true), 10);
        }
    }, [location.pathname]);

    return (
        <div className={styles.videoChat}>
            <main className={styles.main}>
                <div className={styles.videoBox}>
                    <div className={styles.videoBoxImage}>
                        <LogoBig />
                    </div>
                </div>
            </main>
            <section className={styles.sidebar}>
                <div className={styles.sidebarInner}>
                    <div
                        className={clsx(styles.sidebarContent, isActive && styles.active)}
                    >
                        {/* sidebar content */}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default VideoChat;