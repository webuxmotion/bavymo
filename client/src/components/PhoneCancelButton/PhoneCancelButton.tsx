import PhoneCancel from '@/icons/PhoneCancel';
import { useSocket } from '@/socket/useSocket';
import { useRoomStore } from '@/store/useRoomStore';
import styles from './PhoneCancelButton.module.scss';

export default function PhoneCancelButton() {
  const { socket } = useSocket();
  const room = useRoomStore(s => s.room);


  const handleClick = () => {
    if (room && socket) {
      socket.emit("end-call", { roomId: room.roomId });
    }
  }

  return (
    <div className={styles.phoneCancel} onClick={handleClick}>
      <PhoneCancel />
    </div>
  );
}
