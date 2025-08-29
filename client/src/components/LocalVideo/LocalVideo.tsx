import { useEffect, useState } from "react";
import MicVisualizer from '../MicVisualizer/MicVisualizer';
import styles from './LocalVideo.module.scss';
import { useLocalVideoRef } from '@/hooks/useLocalVideoRef';
import clsx from 'clsx';
import { useRoomStore } from "@/store/useRoomStore";

export default function LocalVideo() {
  const videoRef = useLocalVideoRef();
  const [aspectRatio, setAspectRatio] = useState(1); // default 1:1
  const room = useRoomStore(s => s.room);

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
        room?.callStatus === "connected" && styles.active
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