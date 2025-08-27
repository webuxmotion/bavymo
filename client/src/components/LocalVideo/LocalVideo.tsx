import { useAppContext } from '@/providers/AppProvider';
import MicVisualizer from '../MicVisualizer/MicVisualizer';
import styles from './LocalVideo.module.scss';
import { useLocalVideoRef } from '@/hooks/useLocalVideoRef';
import clsx from 'clsx';

export default function LocalVideo() {
  const videoRef = useLocalVideoRef();
  const { data } = useAppContext();

  return (
    <div
      className={clsx(
        styles.localVideo,
        data.call.status === "connected" && styles.active
      )}
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