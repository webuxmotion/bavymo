import { Phone, PhoneOff } from "lucide-react";
import styles from "./CallModal.module.scss";
import Modal from "@/components/Modal/Modal";

interface CallModalProps {
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  type: "incoming" | "outgoing";
  callerName: string | undefined;
}

export default function CallModal({
  open,
  onClose,
  onAccept,
  onReject,
  type,
  callerName,
}: CallModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2>{type === "incoming" ? "Incoming Call" : "Calling..."}</h2>
      <p>{callerName}</p>

      <div className={styles.actions}>
        {type === "incoming" && (
          <button className={styles.accept} onClick={onAccept}>
            <Phone size={20} /> Accept
          </button>
        )}
        <button className={styles.reject} onClick={onReject}>
          <PhoneOff size={20} /> {type === "incoming" ? "Reject" : "Cancel"}
        </button>
      </div>
    </Modal>
  );
}