import { useGameStore } from '@/store/useGameStore';
import styles from './TicTacToeGame.module.scss';
import { useAppContext } from '@/providers/AppProvider';
import clsx from 'clsx';
import Cross from './icons/Cross';
import Zero from './icons/Zero';
import type { GameMove } from '@server/shared/types';
import { useSocket } from '@/socket/useSocket';

const cells = Array.from({ length: 9 }, (_, i) => i);

export default function TicTacToeGame() {
  const game = useGameStore(s => s.game);
  const { user } = useAppContext();
  const { socket } = useSocket();

  if (!game || !user) return;

  const checkIsYourTurn = () => {
    if (!game || !user) return false;

    const movesCount = game.moves.length;

    // First move belongs to user1
    const isUser1Turn = movesCount % 2 === 0;

    if (isUser1Turn) {
      return user.personalCode === game.user1.personalCode;
    } else {
      return user.personalCode === game.user2.personalCode;
    }
  };

  const isYourTurn = checkIsYourTurn();

  const handleClickCell = (cellId: number) => {
    if (isYourTurn && socket) {
      const symbolName = user.personalCode === game.user1.personalCode ? "cross" : "zero";
      const divider = "|";
      const moveString = `${cellId}${divider}${symbolName}`;

      const move: GameMove = {
        sessionId: game.sessionId,
        userId: user.personalCode,
        content: moveString,
        timestamp: Date.now(),
      }

      socket.emit("game-move", move);
    }
  }

  const movesObj: Record<number, string> = {};

  game.moves.forEach(move => {
    const [index, symbol] = move.content.split('|');
    movesObj[Number(index)] = symbol;
  });

  const yourSymbol = user.personalCode === game.user1.personalCode ? "cross" : "zero";
  const opponentSymbol = yourSymbol === "cross" ? "zero" : "cross";

  return (
    <div className={styles.ticTacToeGame}>
      <div className={styles.header}>
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
      </div>
      <div className={clsx(
        styles.grid,
        !isYourTurn && styles.disabled
      )}>
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
              {movesObj[index] ? (
                <>
                  {movesObj[index] === "cross" ? <Cross /> : <Zero />}
                </>
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}