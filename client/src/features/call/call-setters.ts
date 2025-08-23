import type { Call } from "./callTypes";
import type { AppContextType } from "@/providers/AppProvider";

// Accept setData from AppProvider
export function createCallSetters(setData: AppContextType["setData"]) {
  return {
    setCallerId: (callerId: Call["callerId"]) => {
      setData(prev => ({
        ...prev,
        call: { ...prev.call, callerId }
      }));
    },
    setCalleeId: (calleeId: Call["calleeId"]) => {
      setData(prev => ({
        ...prev,
        call: { ...prev.call, calleeId }
      }));
    },
    setOutgoing: (outgoing: Call["outgoing"]) => {
      setData(prev => ({
        ...prev,
        call: { ...prev.call, outgoing }
      }));
    },
    setIncoming: (incoming: Call["incoming"]) => {
      setData(prev => ({
        ...prev,
        call: { ...prev.call, incoming }
      }));
    },
    setCallStatus: (status: Call["status"]) => {
      setData(prev => ({
        ...prev,
        call: { ...prev.call, status }
      }));
    },
    resetCall: () => {
      setData(prev => ({
        ...prev,
        call: {
          outgoing: false,
          incoming: false,
          status: "idle" // or whatever your initialCallData.status is
        }
      }));
    }
  };
}