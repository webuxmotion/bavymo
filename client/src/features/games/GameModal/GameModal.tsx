import { useGameStore } from '@/store/useGameStore';
import styles from './GameModal.module.scss';
import { useAppContext } from '@/providers/AppProvider';
import GameRequest from '../GameRequest/GameRequest';
import TicTacToeGame from '../TicTacToeGame/TicTacToeGame';

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
          {game.gameStatus === "requesting" && <GameRequest />}
          {game.gameStatus === "started" && <TicTacToeGame />}
        </main>
      </div>
    </div>
  );
}