import { useState } from 'react';
import Copy from '../../icons/Copy';
import { useSocket } from '../../socket/useSocket';
import styles from './PersonalCode.module.scss';

export default function PersonalCode() {
  const [copied, setCopied] = useState(false);
  const { personalCode } = useSocket();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(personalCode);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={styles.personalCode}>
      <span className={styles.title}>Your code:</span>
      <span className={styles.code}>{personalCode}</span>
      <button className={styles.button} onClick={handleCopy}>
        <Copy />
      </button>
      {copied && <span className={styles.copied}>Copied!</span>}
    </div>
  );
}
