import { useGameStore } from '@/store/useGameStore';
import styles from './GameModal.module.scss';

export default function GameModal() {
  const game = useGameStore(s => s.game);

  console.log(game);

  return (
    <div className={styles.gameModal}>
      <div className={styles.window}>
        <header className={styles.header}>
          <h2>TIC-TAC-TOE</h2>
          <button>Close</button>
        </header>
        {/* {JSON.stringify(game)} */}
      </div>
    </div>
  );
}
