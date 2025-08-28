import Profile from '@/icons/Profile';
import { useAppContext } from '@/providers/AppProvider';
import { useRoomStore } from '@/store/useRoomStore';
import styles from './Header.module.scss';

export default function Header() {
  const room = useRoomStore(s => s.room);
  const { user } = useAppContext();

  if (!room || !user) return;

  if (room.callStatus !== "connected") return;

  const recipient = room.participants.find(
    (p) => p.personalCode !== user.personalCode
  );

  return (
    <div className={styles.header}>
      <div className={styles.user}>
        <span className={styles.userIcon}>
          <Profile />
        </span>
        <span className={styles.userTitle}>{recipient?.personalCode}</span>
      </div>
    </div>
  );
}
