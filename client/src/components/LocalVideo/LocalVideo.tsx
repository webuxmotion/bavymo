import styles from './LocalVideo.module.scss';
import { useVideoStream } from '@/hooks/useVideoStream';

export default function LocalVideo() {
  const videoRef = useVideoStream();

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