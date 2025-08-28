import MicButton from '@/components/MicButton/MicButton';
import PhoneCancelButton from '@/components/PhoneCancelButton/PhoneCancelButton';
import ScreenShareButton from '@/components/ScreenShareButton/ScreenShareButton';
import ToggleVideoButton from '@/components/ToggleVideoButton/ToggleVideoButton';

import clsx from 'clsx';
import styles from './VideoControls.module.scss';

export default function VideoControls() {
  return (
    <div className={clsx(
      styles.videoControls,
      "gap-2"
    )}>
      <MicButton />
      <ToggleVideoButton />
      <ScreenShareButton />
      <span className='p-2' />
      <PhoneCancelButton />
    </ div>
  );
}
