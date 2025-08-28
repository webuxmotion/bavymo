import SendMessageIcon from '@/icons/SendMessageIcon';
import styles from './MessageInput.module.scss';

export default function MessageInput() {


  return (
    <form className={styles.messageInput}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          placeholder='Your message here...'
        />
      </div>
      <div>
        <button className={styles.button}>
          <SendMessageIcon />
        </button>
      </div>
    </form>
  );
}
