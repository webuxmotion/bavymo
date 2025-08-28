import clsx from 'clsx';
import MessageInput from '../MessageInput/MessageInput';
import styles from './Chat.module.scss';
import { useEffect, useRef } from 'react';

type Message = {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: number;
};

const messages: Message[] = [
  { id: "1", chatId: "1", senderId: "4", recipientId: "6", content: "Hey! How are you?", timestamp: 1693123200000 },
  { id: "2", chatId: "1", senderId: "6", recipientId: "4", content: "Hi! I'm good, thanks. How about you?", timestamp: 1693123260000 },
  { id: "3", chatId: "1", senderId: "4", recipientId: "6", content: "Pretty good. Just finished work.", timestamp: 1693123320000 },
  { id: "4", chatId: "1", senderId: "6", recipientId: "4", content: "Nice! Did you have a busy day?", timestamp: 1693123380000 },
  { id: "5", chatId: "1", senderId: "4", recipientId: "6", content: "Yeah, a lot of meetings 😅", timestamp: 1693123440000 },
  { id: "6", chatId: "1", senderId: "6", recipientId: "4", content: "Oh no. At least it’s over!", timestamp: 1693123500000 },
  { id: "7", chatId: "1", senderId: "4", recipientId: "6", content: "True. What are you up to?", timestamp: 1693123560000 },
  { id: "8", chatId: "1", senderId: "6", recipientId: "4", content: "Just relaxing, watching a show.", timestamp: 1693123620000 },
  { id: "9", chatId: "1", senderId: "4", recipientId: "6", content: "Cool! Which one?", timestamp: 1693123680000 },
  { id: "10", chatId: "1", senderId: "6", recipientId: "4", content: "Stranger Things. Rewatching it 😁", timestamp: 1693123740000 },
  { id: "11", chatId: "1", senderId: "4", recipientId: "6", content: "Nice choice! I love that show.", timestamp: 1693123800000 },
  { id: "12", chatId: "1", senderId: "6", recipientId: "4", content: "We should watch it together sometime!", timestamp: 1693123860000 },
];

export default function Chat() {
  const userId = "6";

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className={styles.chat}>
      <header>
        header
      </header>
      <main className={styles.main}>
        <div className={styles.scrollable} ref={scrollRef}>
          {messages.map(message => {
            const date = new Date(message.timestamp);
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateString = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <div
                key={message.id}
                className={clsx(
                  styles.messageWrapper,
                  userId === message.senderId && styles.isSender
                )}
              >
                <div className={styles.message}>
                  {message.content}
                  <div className={styles.meta}>
                    <span className={styles.time}>{timeString}</span>
                    <span className={styles.date}>{dateString}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <footer>
        <MessageInput />
      </footer>
    </div>
  );
}
