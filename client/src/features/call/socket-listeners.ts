// features/call/socket-listeners.ts
import type { Socket } from "socket.io-client";
import type { CallSetters } from "./callTypes";

export function initCallListeners(socket: Socket, callSetters: CallSetters) {
    socket.on("call-accepted", () => {
        console.log("Call accepted");
    });

    socket.on("call-rejected", () => {
        console.log("Call rejected");
    });

    socket.on("call", ({ callerUser }) => {
        console.log("Incoming call", callerUser);
        callSetters.setIncoming(true);
        callSetters.setCallerId(callerUser.personalCode);
        callSetters.setCallStatus("ringing");
    });

    socket.on("cancel-call", () => {
        console.log("Call cancelled");
    });
}