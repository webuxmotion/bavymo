import styles from './Video.module.scss';
import LogoBig from "../../icons/LogoBig";
import LocalVideo from '../LocalVideo/LocalVideo';

export default function Video() {

  return (
    <div
      className={styles.video}
    >
      <div className={styles.spacer} />
      <div className={styles.content}>
        <div className={styles.localVideoWrapper}><LocalVideo /></div>
        <div className={styles.image}>
          <LogoBig />
        </div>
      </div>
    </div>
  );
}