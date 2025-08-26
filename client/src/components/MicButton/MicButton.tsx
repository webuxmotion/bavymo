
import { useStreamsStore } from "@/store/useStreamsStore";
import { Tooltip } from "../Tooltip/Tooltip";
import styles from './MicButton.module.scss';
import Mic from "@/icons/Mic";
import { switchAudio } from "@/utils/switchAudio";
import MicOff from "@/icons/MicOff";

export default function MicButton() {
  const { localAudioActive } = useStreamsStore();

  return (
    <Tooltip
      content={localAudioActive ? "Disable Mic" : "Enable Mic"}
      delay={200}
    >
      <button
        className={styles.micButton}
        onClick={() => switchAudio(localAudioActive)}
      >
        {localAudioActive ? <Mic /> : <MicOff />}
      </button>
    </Tooltip>
  );
}
