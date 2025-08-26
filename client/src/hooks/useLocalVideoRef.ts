import { useEffect, useRef } from "react";
import { useStreamsStore } from "@/store/useStreamsStore";

export function useLocalVideoRef() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { localStream, screenSharingActive, screenSharingStream } = useStreamsStore();

  useEffect(() => {
    if (videoRef.current) {
      if (screenSharingActive && screenSharingStream) {
        videoRef.current.srcObject = screenSharingStream;
      } else if (!screenSharingActive && localStream) {
        videoRef.current.srcObject = localStream;
      }
    }
  }, [localStream, screenSharingActive, screenSharingStream]);

  return videoRef;
}