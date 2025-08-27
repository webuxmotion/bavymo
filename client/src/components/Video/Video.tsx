import LogoBig from "@/icons/LogoBig";
import LocalVideo from '../LocalVideo/LocalVideo';
import { useRef } from 'react';
import Jobs from '@/icons/Jobs';
import RemoteVideo from '../RemoteVideo/RemoteVideo';
import { useStreamsStore } from '@/store/useStreamsStore';
import { useAnimatedUsers } from './useAnimatedUsers';
import clsx from 'clsx';
import { useAppContext } from '@/providers/AppProvider';
import styles from './Video.module.scss';

export default function Video() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { remoteStream } = useStreamsStore();
  const { data } = useAppContext();

  const animatedUsers = useAnimatedUsers(contentRef);

  return (
    <div
      className={clsx(
        styles.video,
        data.call.status === "connected" && styles.active
      )}
    >
      <div className={styles.spacer} />
      <div className={styles.content} ref={contentRef}>

        {remoteStream ? (
          <RemoteVideo />
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

        <div className={styles.localVideoWrapper}>
          <LocalVideo />
        </div>
      </div>
    </div>
  );
}