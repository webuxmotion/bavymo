import { useStreamsStore } from '@/store/useStreamsStore';
import { Tooltip } from '../Tooltip/Tooltip';
import styles from './ToggleVideoButton.module.scss';
import Camera from '@/icons/Camera';
import CameraOff from '@/icons/CameraOff';
import { toggleCamera } from '@/utils/toggleCamera';
import clsx from 'clsx';

export default function ToggleVideoButton() {
  const { localVideoActive } = useStreamsStore();

  return (
    <Tooltip
      content={localVideoActive ? "Disable Camera" : "Enable Camera"}
      delay={200}
    >
      <button
        className={clsx(
          styles.toggleVideoButton,
          !localVideoActive && styles.offState
        )}
        onClick={() => toggleCamera()}
      >
        {localVideoActive ? <Camera /> : <CameraOff />}
      </button>
    </Tooltip>
  );
}
