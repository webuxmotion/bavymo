import { useEffect, useRef } from "react";
import { useData } from '@/hooks/useData';

export function useRemoteVideoStream() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { remoteStream } = useData();

  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return videoRef;
}