import MessageInput from '../MessageInput/MessageInput';
import styles from './Chat.module.scss';

export default function Chat() {
  return (
    <div className={styles.chat}>
      <header>
header
      </header>
      <main className={styles.main}>
main
      </main>
      <footer>
        <MessageInput />
      </footer>
    </div>
  );
}
