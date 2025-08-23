
import { useSocket } from "@/providers/useSocket";
import CallModal from "../CallModal/CallModal";
import { useAppContext } from "@/providers/AppProvider";

function CallModals() {
    const { data: { call }, callSetters, user } = useAppContext();
    const { socket } = useSocket();

    const handleAccept = () => {
        callSetters.setIncoming(false);

        socket?.emit("call-accept", { caller: call.callerId, callee: user.personalCode });
    }

    const handleReject = () => {

    }

    return (
        <div>
            {call.callerId && (
                <CallModal
                    onClose={() => { }}
                    open={call.incoming}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    type="incoming"
                    callerName={call.callerId}
                />
            )}
        </div>
    )
}

export default CallModals