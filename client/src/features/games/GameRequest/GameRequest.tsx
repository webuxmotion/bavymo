import { useGameStore } from '@/store/useGameStore';
import styles from './GameRequest.module.scss';
import { useAppContext } from '@/providers/AppProvider';

export default function GameRequest() {
  const game = useGameStore(s => s.game);
  const { user } = useAppContext();

  if (!game || !user) return null;

  if (game.gameStatus !== "requesting") return null;

  return (
    <div className={styles.gameRequest}>
      {game.user2.personalCode === user.personalCode ? (
        <>
          The user with ID: {game.user1.personalCode} wants to play 
          Tic-Tac-Toe with you
          <div className={styles.actions}>
            <button className={styles.accept}>Play</button>
            <button className={styles.reject}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          Sending request to {game.user2.personalCode}
          <div className={styles.actions}>
            <button className={styles.reject}>Cancel</button>
          </div>
        </>
      )}
    </div>
  )
}
