import type { createCallSetters } from "./call-setters";

export type CallStatus = "idle" | "calling" | "ringing" | "connected" | "ended";

export type Call = {
    outgoing: boolean;        // true if this user initiated the call
    incoming: boolean;        // true if another user is calling you
    status: CallStatus;       // current status of the call
    callerId?: string;        // ID of the user who initiated the call
    calleeId?: string;        // ID of the user being called
    startedAt?: Date;         // timestamp when call started
    endedAt?: Date;           // timestamp when call ended
};

export type CallSetters = ReturnType<typeof createCallSetters>;