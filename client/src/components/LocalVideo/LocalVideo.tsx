import { useEffect, useState } from "react";
import { useAppContext } from '@/providers/AppProvider';
import MicVisualizer from '../MicVisualizer/MicVisualizer';
import styles from './LocalVideo.module.scss';
import { useLocalVideoRef } from '@/hooks/useLocalVideoRef';
import clsx from 'clsx';

export default function LocalVideo() {
  const videoRef = useLocalVideoRef();
  const { data } = useAppContext();
  const [aspectRatio, setAspectRatio] = useState(1); // default 1:1

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateAspect = () => {
      if (video.videoWidth && video.videoHeight) {
        setAspectRatio(video.videoWidth / video.videoHeight);
      }
    };

    video.addEventListener("loadedmetadata", updateAspect);
    return () => {
      video.removeEventListener("loadedmetadata", updateAspect);
    };
  }, [videoRef]);

  return (
    <div
      className={clsx(
        styles.localVideo,
        data.call.status === "connected" && styles.active
      )}
      style={{ aspectRatio }}
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