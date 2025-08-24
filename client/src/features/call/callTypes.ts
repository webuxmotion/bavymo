import type { createCallSetters } from "./call-setters";

export type CallStatus = "idle" | "calling" | "ringing" | "connected" | "ended";

export type Call = {
    outgoing: boolean;        
    incoming: boolean;        
    status: CallStatus;       
    callerId?: string;        
    calleeId?: string;        
    startedAt?: Date;         
    endedAt?: Date;          
};

export type CallSetters = ReturnType<typeof createCallSetters>;