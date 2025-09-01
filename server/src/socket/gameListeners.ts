import { GameMove, NewGamePayload } from "../shared/types";
import { gameStore } from "../store/gameStore";
import { roomStore } from "../store/roomStore";
import { userStore } from "../store/userStore";
import generateId from "../utils/generateId";
import { Server, Socket } from "socket.io";

type GameListenersProps = {
  socket: Socket;
  io: Server;
};

const gameListeners = ({ socket, io }: GameListenersProps) => {
  socket.on("new-game", ({ game }: NewGamePayload) => {
    const { roomId, gameId, userPersonalCode } = game;

    const user1 = userStore.findByPersonalCode(userPersonalCode);
    const room = roomStore.getRoom(roomId);

    if (!room || room.callStatus === "ended") return;

    const user2 = room?.participants.filter(
      (el) => el.personalCode !== userPersonalCode
    )[0];

    if (user1 && user2) {
      const sessionId = generateId();

      const newGame = {
        sessionId,
        gameId,
        user1,
        user2,
        roomId: room.roomId,
      };

      gameStore.createGame(newGame);

      const createdGame = gameStore.getGame(sessionId);

      if (createdGame) {
        io.to(room.participants.map((p) => p.socketId)).emit(
          "game",
          createdGame
        );
      }
    }
  });

  socket.on("game-accepted", ({ gameSessionId }) => {
    const game = gameStore.getGame(gameSessionId);

    if (game) {
      gameStore.updateGameStatus(game.sessionId, "started");

      const updatedGame = gameStore.getGame(game.sessionId);

      if (updatedGame) {
        io.to(game.user1.socketId).emit("game", updatedGame);
        io.to(game.user2.socketId).emit("game", updatedGame);
      }
    }
  });

  socket.on("game-move", (gameMove: GameMove) => {
    const game = gameStore.getGame(gameMove.sessionId);

    if (game) {
      gameStore.addMove(game.sessionId, gameMove);

      const updatedGame = gameStore.getGame(gameMove.sessionId);

      if (updatedGame) {
        io.to(game.user1.socketId).emit("game", updatedGame);
        io.to(game.user2.socketId).emit("game", updatedGame);
      }
    }
  });

  socket.on("game-restart", ({ sessionId }) => {
    const game = gameStore.restartGame(sessionId);

    if (game) {
      io.to(game.user1.socketId).emit("game", game);
      io.to(game.user2.socketId).emit("game", game);
    }
  });

  socket.on("game-close", ({ sessionId }) => {
    const game = gameStore.getGame(sessionId);

    if (game) {
      gameStore.removeGame(sessionId);

      io.to(game.user1.socketId).emit("game", null);
      io.to(game.user2.socketId).emit("game", null);
    }
  });
};

export default gameListeners;
