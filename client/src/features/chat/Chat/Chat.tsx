import clsx from 'clsx';
import MessageInput from '../MessageInput/MessageInput';
import styles from './Chat.module.scss';
import { useEffect, useRef } from 'react';
import { useAppContext } from '@/providers/AppProvider';
import { useMessagesStore } from '@/store/useMessagesStore';
import Header from '../Header/Header';

export default function Chat() {
  const { user } = useAppContext();
  const messages = useMessagesStore(s => s.messages);

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
        <Header />
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
                  user.personalCode === message.senderId && styles.isSender
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
