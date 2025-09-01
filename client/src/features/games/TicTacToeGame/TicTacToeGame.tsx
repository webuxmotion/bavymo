import { useGameStore } from '@/store/useGameStore';
import styles from './TicTacToeGame.module.scss';
import { useAppContext } from '@/providers/AppProvider';
import clsx from 'clsx';
import Cross from './icons/Cross';
import Zero from './icons/Zero';
import type { GameMove } from '@server/shared/types';
import { useSocket } from '@/socket/useSocket';
import Cell from './Cell';
import { checkIsYourTurn, checkWinner, getPlayersInfo, parseMoves } from './gameUtils';

const cells = Array.from({ length: 9 }, (_, i) => i);

export default function TicTacToeGame() {
  const game = useGameStore(s => s.game);
  const { user } = useAppContext();
  const { socket } = useSocket();

  if (!game || !user) return null;

  const { you, opponent } = getPlayersInfo(game, user.personalCode);
  const movesObj = parseMoves(game.moves);
  const winner = checkWinner(movesObj);
  const isBoardFull = cells.every(c => movesObj[c]);
  const isDraw = !winner && isBoardFull;
  const isYourTurn = !winner && !isDraw && checkIsYourTurn(game, user.personalCode);

  const handleClickCell = (cellId: number) => {
    if (isYourTurn && socket && !movesObj[cellId]) {
      const symbolName = user.personalCode === game.user1.personalCode ? "cross" : "zero";
      const moveString = `${cellId}|${symbolName}`;
      const move: GameMove = {
        sessionId: game.sessionId,
        userId: user.personalCode,
        content: moveString,
        timestamp: Date.now(),
      }
      socket.emit("game-move", move);
    }
  };

  const handleRestartGame = () => {
    if (socket) {
      socket.emit("game-restart", { sessionId: game.sessionId });
    }
  }

  return (
    <div className={styles.ticTacToeGame}>
      <div className={styles.header}>
        {winner ? (
          <div className={styles.winner}>
            {winner === "cross" ? <Cross /> : <Zero />}{" "}
            {you.symbol === winner ? "You win!" : `Player: ${opponent.personalCode} wins!`}
            <br />
            <button onClick={handleRestartGame}>Restart game</button>
          </div>
        ) : isDraw ? (
          <div className={styles.winner}>
            🤝 It's a draw!
            <br />
            <button onClick={handleRestartGame}>Restart game</button>
          </div>
        ) : (
          <>
            <span className={isYourTurn ? styles.active : ""}>
              {you.symbol === "cross" ? <Cross /> : <Zero />} YOU
            </span>
            <span className={!isYourTurn ? styles.active : ""}>
              {opponent.symbol === "cross" ? <Cross /> : <Zero />} Player: {opponent.personalCode}
            </span>
          </>
        )}
      </div>

      <div className={clsx(styles.grid, (!isYourTurn || winner) && styles.disabled)}>
        {cells.map((cell) => (
          <Cell
            key={cell}
            index={cell}
            symbol={movesObj[cell]}
            disabled={!isYourTurn || !!winner}
            onClick={handleClickCell}
          />
        ))}
      </div>
    </div>
  );
}