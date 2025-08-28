import SendMessageIcon from '@/icons/SendMessageIcon';
import { useSocket } from '@/socket/useSocket';
import { useRoomStore } from '@/store/useRoomStore';
import type { Message } from '@server/shared/types';
import { useState } from 'react';
import styles from './MessageInput.module.scss';
import { useAppContext } from '@/providers/AppProvider';

export default function MessageInput() {
  const { socket } = useSocket();
  const { user } = useAppContext();
  const room = useRoomStore((s) => s.room);
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!socket || !value.trim() || !room) return;
    if (room.callStatus !== "connected") return;

    const recipient = room.participants.find(
      (p) => p.personalCode !== user.personalCode
    );

    if (!recipient) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      roomId: room.roomId,
      senderId: user.personalCode,
      recipientId: recipient.personalCode,
      content: value.trim(),
      timestamp: Date.now(),
    };

    socket.emit("message", { message: newMessage });
    setValue(""); // clear input after sending
  };

  return (
    <form className={styles.messageInput} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={styles.input}
          placeholder="Your message here..."
        />
      </div>
      <div>
        <button type="submit" className={styles.button}>
          <SendMessageIcon />
        </button>
      </div>
    </form>
  );
}