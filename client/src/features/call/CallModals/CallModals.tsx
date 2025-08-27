
import { useSocket } from "@/providers/useSocket";
import CallModal from "../CallModal/CallModal";
import { useAppContext } from "@/providers/AppProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAudio } from "@/providers/AudioProvider";

function CallModals() {
    const { data: { call }, callSetters, user } = useAppContext();
    const { socket } = useSocket();
    const location = useLocation();
    const navigate = useNavigate();
    const { play, stop } = useAudio();

    useEffect(() => {
        if (call.status === "ringing") {
            play();
        } else {
            stop();
        }

    }, [call, play, stop]);

    const handleAccept = () => {
        callSetters.setIncoming(false);
        callSetters.setCallStatus("connected");

        if (location.pathname !== "/video-chat") {
            navigate("/video-chat");
        }

        socket?.emit("call-accept", { caller: call.callerId, callee: user.personalCode });
    }

    const handleReject = () => {
        socket?.emit("call-reject", { caller: call.callerId });

        callSetters.resetCall();
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