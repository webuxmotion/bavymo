import MicVisualizer from '../MicVisualizer/MicVisualizer';
import styles from './LocalVideo.module.scss';
import { useLocalVideoRef } from '@/hooks/useLocalVideoRef';

export default function LocalVideo() {
  const videoRef = useLocalVideoRef();

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

      <MicVisualizer />
    </div>
  );
}