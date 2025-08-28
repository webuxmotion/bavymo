import Jobs from '@/icons/Jobs';
import LogoBig from "@/icons/LogoBig";
import UserLoading from "@/icons/UserLoading";
import { useRoomStore } from "@/store/useRoomStore";
import { useStreamsStore } from '@/store/useStreamsStore';
import clsx from 'clsx';
import { useRef } from 'react';
import LocalVideo from '../LocalVideo/LocalVideo';
import RemoteVideo from '../RemoteVideo/RemoteVideo';
import { useAnimatedUsers } from './useAnimatedUsers';
import styles from './Video.module.scss';

export default function Video() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { remoteStream } = useStreamsStore();
  const room = useRoomStore(s => s.room);

  const animatedUsers = useAnimatedUsers(contentRef);

  return (
    <div
      className={clsx(
        styles.video,
        room?.callStatus === "connected" && styles.active
      )}
    >
      <div className={styles.spacer} />
      <div className={styles.content} ref={contentRef}>

        {remoteStream ? (
          <RemoteVideo />
        ) : (
          <>
            {room?.callStatus === "accepted" ? (
              <div className={styles.image}>
                <UserLoading />
              </div>
            ) : (
              <>
                <div className={styles.image}>
                  <LogoBig />
                </div>
                <div className={styles.users}>
                  {animatedUsers.map(u => (
                    <div
                      key={u.socketId}
                      className={styles.user}
                      style={{ transform: `translate(${u.x}px, ${u.y}px)` }}
                    >
                      <div className={styles.userIcon}>
                        <Jobs.Worker />
                      </div>
                      <span className={styles.userTitle}>{u.personalCode}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <div className={styles.localVideoWrapper}>
          <LocalVideo />
        </div>
      </div>
    </div>
  );
}