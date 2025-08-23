import { useState } from 'react';
import Copy from '@/icons/Copy';
import styles from './PersonalCode.module.scss';
import { useAppContext } from '@/providers/AppProvider';

export default function PersonalCode() {
  const [copied, setCopied] = useState(false);
  const { user: { personalCode } } = useAppContext();

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
      <button className={styles.button} onClick={handleCopy} tabIndex={5}>
        <Copy />
      </button>
      {copied && <span className={styles.copied}>Copied!</span>}
    </div>
  );
}
