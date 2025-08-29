import { NewGamePayload } from "../shared/types";
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
      };

      gameStore.createGame(newGame);

      const createdGame = gameStore.getGame(sessionId);

      if (createdGame) {
        io.to(room.participants.map(p => p.socketId)).emit("game", createdGame);
      }
    }
  });
};

export default gameListeners;
