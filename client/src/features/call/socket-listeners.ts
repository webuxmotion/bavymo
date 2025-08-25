import type { Socket } from "socket.io-client";
import type { CallSetters } from "./callTypes";

export function initCallListeners({
    socket,
    callSetters,
}: {
    socket: Socket;
    callSetters: CallSetters;
}) {
    socket.on("call", ({ callerUser }) => {
        callSetters.setIncoming(true);
        callSetters.setCallerId(callerUser.personalCode);
        callSetters.setCallStatus("ringing");
    });

    socket.on("cancel-call", () => {
        callSetters.setIncoming(false);
        callSetters.setCallerId("");
        callSetters.setCallStatus("idle");
    });
}