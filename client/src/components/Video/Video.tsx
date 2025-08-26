import styles from './Video.module.scss';
import LogoBig from "@/icons/LogoBig";
import LocalVideo from '../LocalVideo/LocalVideo';
import { useSocket } from '@/providers/useSocket';
import { useEffect, useRef, useState } from 'react';
import Jobs from '@/icons/Jobs';
import type { OnlineUser } from '@server/shared/types';
import RemoteVideo from '../RemoteVideo/RemoteVideo';
import { useData } from '@/hooks/useData';
import { useAppContext } from '@/providers/AppProvider';
import { useUsersStore } from '@/store/useUsersStore';
import MicVisualizer from '../MicVisualizer/MicVisualizer';

interface AnimatedUser extends OnlineUser {
  x: number;
  y: number;
  dx: number; // швидкість по X
  dy: number; // швидкість по Y
}

export default function Video() {
  const { socket } = useSocket();
  const [animatedUsers, setAnimatedUsers] = useState<AnimatedUser[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const { remoteStream } = useData();
  const { user } = useAppContext();

  const onlineUsers = useUsersStore((state) => state.users);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (!contentRef.current) return;

      const { width, height } = contentRef.current.getBoundingClientRect();

      setAnimatedUsers(prev =>
        prev.map(u => {
          let newX = u.x + u.dx;
          let newY = u.y + u.dy;

          const maxX = width - 50; // 50 — розмір іконки або відступ
          const maxY = height - 50;

          if (newX <= 0 || newX >= maxX) u.dx = -u.dx;
          if (newY <= 0 || newY >= maxY) u.dy = -u.dy;

          newX = Math.max(0, Math.min(maxX, newX));
          newY = Math.max(0, Math.min(maxY, newY));

          return { ...u, x: newX, y: newY, dx: u.dx, dy: u.dy };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (onlineUsers.length && socket && contentRef.current) {
      const { width, height } = contentRef.current.getBoundingClientRect();
      const centerX = width / 2;
      const centerY = height / 2;

      const users = onlineUsers
        .filter(u => u.personalCode !== user.personalCode)
        .map(u => ({
          ...u,
          // початкова позиція близько до центру з невеликим рандомним зміщенням
          x: centerX + (Math.random() - 0.5) * 50, // ±25px від центру
          y: centerY + (Math.random() - 0.5) * 50, // ±25px від центру
          dx: (Math.random() - 0.5) * 2, // швидкість X
          dy: (Math.random() - 0.5) * 2, // швидкість Y
        }));

      setAnimatedUsers(users);
    }
  }, [onlineUsers, socket]);

  return (
    <div
      className={styles.video}
    >
      <div className={styles.spacer} />
      <div className={styles.content} ref={contentRef}>
        <MicVisualizer />

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