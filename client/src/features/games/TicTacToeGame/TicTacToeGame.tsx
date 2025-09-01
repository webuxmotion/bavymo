import { useGameStore } from '@/store/useGameStore';
import styles from './TicTacToeGame.module.scss';
import { useAppContext } from '@/providers/AppProvider';
import clsx from 'clsx';
import Cross from './icons/Cross';
import Zero from './icons/Zero';
import type { GameMove } from '@server/shared/types';
import { useSocket } from '@/socket/useSocket';

const cells = Array.from({ length: 9 }, (_, i) => i);

const winCombinations: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToeGame() {
  const game = useGameStore(s => s.game);
  const { user } = useAppContext();
  const { socket } = useSocket();

  if (!game || !user) return null;

  const movesObj: Record<number, string> = {};
  game.moves.forEach(move => {
    const [index, symbol] = move.content.split('|');
    movesObj[Number(index)] = symbol;
  });

  const checkIsYourTurn = () => {
    const movesCount = game.moves.length;
    const isUser1Turn = movesCount % 2 === 0;
    return isUser1Turn
      ? user.personalCode === game.user1.personalCode
      : user.personalCode === game.user2.personalCode;
  };

  const checkWinner = () => {
    for (const combo of winCombinations) {
      const [a, b, c] = combo;
      if (
        movesObj[a] &&
        movesObj[a] === movesObj[b] &&
        movesObj[a] === movesObj[c]
      ) {
        return movesObj[a]; // "cross" or "zero"
      }
    }
    return null;
  };

  const winner = checkWinner();
  const isYourTurn = !winner && checkIsYourTurn();

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

  const yourSymbol = user.personalCode === game.user1.personalCode ? "cross" : "zero";
  const opponentSymbol = yourSymbol === "cross" ? "zero" : "cross";

  return (
    <div className={styles.ticTacToeGame}>
      <div className={styles.header}>
        {winner ? (
          <span className={styles.winner}>
            {winner === "cross" ? <Cross /> : <Zero />} Wins!
          </span>
        ) : (
          <>
            <span className={isYourTurn ? styles.active : ""}>
              {yourSymbol === "cross" ? <Cross /> : <Zero />} YOU
            </span>
            <span className={!isYourTurn ? styles.active : ""}>
              {opponentSymbol === "cross" ? <Cross /> : <Zero />} Player: {
                game.user1.personalCode === user.personalCode
                  ? game.user2.personalCode
                  : game.user1.personalCode
              }
            </span>
          </>
        )}
      </div>

      <div className={clsx(styles.grid, (!isYourTurn || winner) && styles.disabled)}>
        {cells.map((cell, index) => (
          <div
            key={cell}
            className={clsx(
              styles.cell,
              movesObj[index] && styles.unavailable
            )}
            onClick={() => handleClickCell(cell)}
          >
            <span>
              {movesObj[index] === "cross" ? <Cross /> : null}
              {movesObj[index] === "zero" ? <Zero /> : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}