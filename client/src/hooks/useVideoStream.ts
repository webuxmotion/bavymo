import { useEffect, useRef } from "react";
import { useData } from '@/hooks/useData';

export function useVideoStream() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { localStream } = useData();

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return videoRef;
}