import { useCallback } from "react";
import { useAppContext } from "@/providers/AppProvider";

export function useLocalVideo() {
  const { setLocalStream } = useAppContext();

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