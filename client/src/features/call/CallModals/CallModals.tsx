
import { useSocket } from "@/providers/useSocket";
import CallModal from "../CallModal/CallModal";
import { useAppContext } from "@/providers/AppProvider";
import { useLocation, useNavigate } from "react-router-dom";

function CallModals() {
    const { data: { call }, callSetters, user } = useAppContext();
    const { socket } = useSocket();
    const location = useLocation();
    const navigate = useNavigate();


    const handleAccept = () => {
        callSetters.setIncoming(false);

        if (location.pathname !== "/video-chat") {
            navigate("/video-chat");
        }

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