import PersonalCode from "@/components/PersonalCode/PersonalCode";
import SidebarContent from "@/components/SidebarContent/SidebarContent";
import SidebarTabs from "@/components/SidebarTabs/SidebarTabs";
import Video from "@/components/Video/Video";
import CallForm from "@/features/call/CallForm/CallForm";
import VideoControls from "@/features/call/VideoControls/VideoControls";
import { useSocket } from "@/socket/useSocket";
import { useRoomStore } from "@/store/useRoomStore";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./VideoChat.module.scss";


function VideoChat() {
    const location = useLocation();
    const [isActive, setIsActive] = useState(false);
    const { randomId } = useSocket();
    const room = useRoomStore(s => s.room);

    useEffect(() => {
        if (location.pathname === "/video-chat") {
            // trigger after mount so transition works
            setTimeout(() => setIsActive(true), 10);
        }
    }, [location.pathname]);

    return (
        <div className={styles.videoChat}>
            <main className={styles.main}>
                {randomId && <PersonalCode randomId={randomId} />}
                <Video />
                {room?.callStatus !== "accepted" && (
                    <>
                        {room?.callStatus !== "connected" ? (
                            <div className="pt-5">
                                <VideoControls />
                            </div>
                        ) : <CallForm />}
                    </>
                )}
            </main>
            <section className={styles.sidebar}>
                <div className={styles.sidebarInner}>
                    <div
                        className={clsx(styles.sidebarContent, isActive && styles.active)}
                    >
                        <header className={styles.sidebarHeader}>
                            <SidebarTabs />
                        </header>
                        <main className={styles.sidebarMain}>
                            <SidebarContent />
                        </main>
                        <div className={styles.borderRadiusBackground} />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default VideoChat;