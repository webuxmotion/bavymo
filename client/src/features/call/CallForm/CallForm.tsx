import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './CallForm.module.scss';
import Camera from '@/icons/Camera';
import CallModal from '../CallModal/CallModal';
import { useAppContext } from '@/providers/AppProvider';
import { useSocket } from '@/providers/useSocket';
import { ScreenShareButton } from '@/components/ScreenShareButton/ScreenShareButton';
import MicButton from '@/components/MicButton/MicButton';
import PhoneCancelButton from '@/components/PhoneCancelButton/PhoneCancelButton';
import ToggleVideoButton from '@/components/ToggleVideoButton/ToggleVideoButton';

export default function CallForm() {
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { callSetters, data, user } = useAppContext();
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

    callSetters.setCallStatus("calling");
    callSetters.setCalleeId(code);
    callSetters.setCallerId(user.personalCode);
    callSetters.setOutgoing(true);

    setCode("");

    socket?.emit("call", { caller: user.personalCode, callee: code });
  }

  const cancelCall = () => {
    callSetters.setCallStatus("idle");
    callSetters.setCalleeId("");
    callSetters.setCallerId("");
    callSetters.setOutgoing(false);

    socket?.emit("cancel-call", data.call.calleeId);
  }

  return (
    <div className={styles.callForm}>

      {data.call.status === "connected" ? (
        <div className='flex justify-center items-center gap-2'>
          
          <MicButton />
          <ToggleVideoButton />
          <ScreenShareButton />
          <span className='p-2'/>
          <PhoneCancelButton />
        </div>
      ) : (
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
      )}

      <CallModal
        onClose={() => { }}
        open={data.call.outgoing}
        onReject={cancelCall}
        type="outgoing"
        callerName={data.call.calleeId}
      />
    </div >
  );
}