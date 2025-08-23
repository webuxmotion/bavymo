
import CallModal from "../CallModal/CallModal";
import { useAppContext } from "@/providers/AppProvider";

function CallModals() {
    const { data: { call }, callSetters } = useAppContext();

    const handleAccept = () => {
        callSetters.setIncoming(false);
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