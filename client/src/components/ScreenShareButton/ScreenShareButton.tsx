import ScreenShare from "@/icons/ScreenShare";
import { useStreamsStore } from "@/store/useStreamsStore";
import { switchScreenSharing } from "@/utils/switchScreenSharing";
import { Tooltip } from "../Tooltip/Tooltip";
import styles from './ScreenShareButton.module.scss';


export function ScreenShareButton() {
  const screenSharingActive = useStreamsStore((s) => s.screenSharingActive);

  return (
    <Tooltip
      content={screenSharingActive ? "Stop Screen Share" : "Start Screen Share"}
      delay={200}
    >
      <button
        className={styles.button}
        onClick={() => switchScreenSharing(screenSharingActive)}
      >
        <ScreenShare />
      </button>
    </Tooltip>
  );
}