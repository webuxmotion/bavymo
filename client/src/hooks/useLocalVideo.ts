import { useCallback } from "react";
import { useStreamsStore } from "@/store/useStreamsStore";

export function useLocalVideo() {
  const setLocalStream = useStreamsStore(s => s.setLocalStream);

  const initMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
    } catch (err) {
      console.error("Failed to access media devices:", err);
    }
  }, [setLocalStream]);

  return {
    initMedia,
  };
}