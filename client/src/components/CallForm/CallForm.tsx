import type { ChangeEvent } from 'react';
import { useState } from 'react';
import styles from './CallForm.module.scss';

export default function CallForm() {
  const [code, setCode] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  return (
    <div className={styles.callForm}>
      <form>
        <input
          type="text"
          value={code}
          onChange={handleChange}
        />
        <button type="submit">Call</button>
      </form>
    </div>
  );
}