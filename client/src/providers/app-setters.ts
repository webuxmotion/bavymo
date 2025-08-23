import { createCallSetters } from "@/features/call/call-setters";
import type { AppContextType } from "./AppProvider";

export function createSetters(setData: AppContextType["setData"]) {
  return {
    setLocalStream: (stream: MediaStream | null) => {
      console.log('setLocalStream(stream)', stream);
      setData(prev => ({ ...prev, localStream: stream }));
    },
    callSetters: createCallSetters(setData)
  };
}