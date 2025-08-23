import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './CallForm.module.scss';
import Camera from '@/icons/Camera';
import CallModal from '../CallModal/CallModal';
import { useSocket } from '@/modules/socket/useSocket';

export default function CallForm() {
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [outgoing, setOutgoing] = useState(false);
  const { socket, personalCode } = useSocket();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleAccept = () => {
      setOutgoing(false);
    }

    const handleReject = () => {
      setOutgoing(false);
    }

    socket.on("call-accept", handleAccept);
    socket.on("call-reject", handleReject);

    return () => {
      socket.off("message", handleAccept);
      socket.off("message", handleReject);
    };
  }, [socket]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!code) return;

    setOutgoing(true);

    const data = {
      caller: personalCode,
      callee: code
    };
    socket?.emit("call", data);
  }

  const cancelCall = () => {
    if (!socket) return;

    socket.emit("cancel-call", code);

    setOutgoing(false);
  }

  return (
    <div className={styles.callForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper} >
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

      <CallModal
        onClose={() => { }}
        open={outgoing}
        onReject={cancelCall}
        type="outgoing"
        callerName={code}
      />
    </div >
  );
}