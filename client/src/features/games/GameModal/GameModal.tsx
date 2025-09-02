import { useRef, useState } from 'react';
import styles from './GameModal.module.scss';
import { useGameStore } from '@/store/useGameStore';
import { useAppContext } from '@/providers/AppProvider';
import GameRequest from '../GameRequest/GameRequest';
import TicTacToeGame from '../TicTacToeGame/TicTacToeGame';
import { useSocket } from '@/socket/useSocket';

export default function GameModal() {
  const game = useGameStore(s => s.game);
  const { user } = useAppContext();
  const { socket } = useSocket();

  const dragRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  if (!game || game.gameStatus === "idle" || !user) return null;

  const handleCloseModal = () => {
    if (socket) {
      socket.emit("game-close", { sessionId: game.sessionId });
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const onMouseUp = () => setDragging(false);

  return (
    <div
      ref={dragRef}
      className={styles.gameModal}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div className={styles.window}>
        <header className={styles.header} onMouseDown={onMouseDown}>
          <h2>TIC-TAC-TOE</h2>
          <button onClick={handleCloseModal}>Close</button>
        </header>
        <main className={styles.content}>
          {game.gameStatus === "requesting" && <GameRequest />}
          {game.gameStatus === "started" && <TicTacToeGame />}
        </main>
      </div>
    </div>
  );
}