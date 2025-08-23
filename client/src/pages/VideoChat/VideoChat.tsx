import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import styles from "./VideoChat.module.scss";
import Video from "@/components/Video/Video";
import PersonalCode from "@/components/PersonalCode/PersonalCode";
import CallForm from "@/features/call/CallForm/CallForm";

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
                <PersonalCode />
                <Video />
                <CallForm />
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