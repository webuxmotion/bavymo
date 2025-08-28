import PhoneCancel from '@/icons/PhoneCancel';
import styles from './PhoneCancelButton.module.scss';
import { useSocket } from '@/socket/useSocket';
import { useData } from '@/hooks/useData';
import { useAppContext } from '@/providers/AppProvider';
import { closePeerConnectionAndResetStore } from '@/utils/closePeerConnectionAndResetStore';

export default function PhoneCancelButton() {
  const { socket } = useSocket();
  const { call } = useData();
  const { user, callSetters } = useAppContext();


  const handleClick = () => {
    const codes = [];

    if (call?.callerId) codes.push(call?.callerId.toUpperCase());
    if (call?.calleeId) codes.push(call?.calleeId.toUpperCase());

    const targetCodeArray = codes.filter(code => code !== user.personalCode.toUpperCase());
    const targetCode = targetCodeArray?.[0];

    if (targetCode) {
      socket?.emit("user-hanged-up", { targetCode });
    }

    closePeerConnectionAndResetStore({ callSetters });
  }

  return (
    <div className={styles.phoneCancel} onClick={handleClick}>
      <PhoneCancel />
    </div>
  );
}
