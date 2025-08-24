import { createCallSetters } from "@/features/call/call-setters";
import type { AppContextType } from "./AppProvider";

export function createSetters(setData: AppContextType["setData"]) {
  return {
    setLocalStream: (stream: MediaStream | null) => {
      setData(prev => ({ ...prev, localStream: stream }));
    },
    setRemoteStream: (stream: MediaStream | null) => {
      setData(prev => ({ ...prev, remoteStream: stream }));
    },
    callSetters: createCallSetters(setData)
  };
}