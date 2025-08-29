import { useAppContext } from '@/providers/AppProvider';
import styles from './Games.module.scss';
import { useRoomStore } from '@/store/useRoomStore';
import { useSocket } from '@/socket/useSocket';
import type { NewGamePayload } from '@server/shared/types';

const gamesList = [
  {
    gameId: "cross-zero",
    title: "Tic-Tac-Toe",
    imageUrl: "/games/tic-tac-toe.jpg"
  }
];

export default function Games() {
  const { user } = useAppContext();
  const room = useRoomStore(s => s.room);
  const { socket } = useSocket();

  const handlePlayButtonClick = (gameId: string) => {
    if (room && user && socket) {
      const newGameData = {
        roomId: room.roomId,
        userPersonalCode: user.personalCode,
        gameId,
      }

      const gamePayload: NewGamePayload = {
        game: newGameData
      }

      socket.emit("new-game", gamePayload);
    }
  }

  return (
    <div className={styles.games}>
      {gamesList.map((game) => (
        <div key={game.gameId} className={styles.card}>
          <img src={game.imageUrl} alt={game.title} />
          <h3>{game.title}</h3>
          <button 
            className={styles.button}
            onClick={() => handlePlayButtonClick(game.gameId)}
          >
            <span>Play</span>
          </button>
        </div>
      ))}
    </div>
  );
}