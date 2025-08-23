import { useRemoteVideoStream } from '@/hooks/useRemoteVideoStream';
import styles from './RemoteVideo.module.scss';

export default function RemoteVideo() {
  const videoRef = useRemoteVideoStream();

  return (
    <div
      className={styles.remoteVideo}
    >
      <video
        className={styles.video}
        ref={videoRef}
        autoPlay
        playsInline
      />
    </div>
  );
}