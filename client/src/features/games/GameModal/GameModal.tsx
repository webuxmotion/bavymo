import { useGameStore } from '@/store/useGameStore';
import styles from './GameModal.module.scss';
import { useAppContext } from '@/providers/AppProvider';
import GameRequest from '../GameRequest/GameRequest';

export default function GameModal() {
  const game = useGameStore(s => s.game);
  const { user } = useAppContext();

  if (!game || game.gameStatus === "idle" || !user) return null;

  

  return (
    <div className={styles.gameModal}>
      <div className={styles.window}>
        <header className={styles.header}>
          <h2>TIC-TAC-TOE</h2>
          <button>Close</button>
        </header>
        <main className={styles.content}>
          <GameRequest />
        </main>
      </div>
    </div>
  );
}