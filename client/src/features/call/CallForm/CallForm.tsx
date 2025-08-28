import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import Camera from '@/icons/Camera';
import { useAppContext } from '@/providers/AppProvider';
import { useSocket } from '@/socket/useSocket';
import styles from './CallForm.module.scss';

export default function CallForm() {
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAppContext();
  const { socket } = useSocket();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setCode("");

    socket?.emit("start-call", { caller: user.personalCode, callee: code });
  }

  return (
    <div className={styles.callForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            tabIndex={0}
            name="code"
            type="text"
            value={code}
            onChange={handleChange}
            className={styles.input}
            placeholder='Paste friend’s code here...'
          />
        </div>
        <button type="submit" className={styles.button} tabIndex={0}>
          <div className={styles.icon}>
            <Camera />
          </div>
          Call
        </button>
      </form>
    </div >
  );
}