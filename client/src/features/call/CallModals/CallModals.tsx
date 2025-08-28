
import { useAppContext } from "@/providers/AppProvider";
import { useAudio } from "@/providers/AudioProvider";
import { useSocket } from "@/socket/useSocket";
import { useRoomStore } from "@/store/useRoomStore";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CallModal from "../CallModal/CallModal";

export default function CallModals() {
    const { user } = useAppContext();
    const { socket } = useSocket();
    const location = useLocation();
    const navigate = useNavigate();
    const { play, stop } = useAudio();
    const room = useRoomStore(s => s.room);
    const isCaller = room ? user.personalCode === room.callerId : false;

    useEffect(() => {
        if (isCaller) stop();
        else play();

        return () => {
            stop();
        }
    }, [isCaller, play, stop]);

    if (!room || !socket) return null;

    const handleAccept = () => {
        if (location.pathname !== "/video-chat") {
            navigate("/video-chat");
        }
        socket.emit("call-accept", { roomId: room.roomId });
    }

    const handleReject = () => {
        socket.emit("call-reject", { roomId: room.roomId });
    }

    const cancelCall = () => {
        socket.emit("call-cancel", { roomId: room.roomId });
    }

    return isCaller ? (
        <CallModal
            onClose={() => { }}
            open={true}
            onReject={cancelCall}
            type="outgoing"
            callerName={room.calleeId}
        />
    ) : (
        <CallModal
            onClose={() => { }}
            open={true}
            onAccept={handleAccept}
            onReject={handleReject}
            type="incoming"
            callerName={room.callerId}
        />
    );
}