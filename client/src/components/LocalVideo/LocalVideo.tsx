import { useEffect, useRef } from 'react';
import { useChat } from '../../modules/chat/useChat';
import styles from './LocalVideo.module.scss';

export default function LocalVideo() {
  const { localStream } = useChat();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div
      className={styles.localVideo}
    >
      <video
        className={styles.video}
        ref={videoRef}
        autoPlay
        playsInline
        muted
      />
    </div>
  );
}