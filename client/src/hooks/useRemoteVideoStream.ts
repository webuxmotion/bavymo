import { useStreamsStore } from "@/store/useStreamsStore";
import { useEffect, useRef } from "react";

export function useRemoteVideoStream() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { remoteStream } = useStreamsStore();

  useEffect(() => {
    if (videoRef.current && remoteStream) {
      videoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return videoRef;
}