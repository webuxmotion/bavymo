import { Game, GameMove, GameStatus, OnlineUser } from "../shared/types";
import generateId from "../utils/generateId";

type CreateGameProps = {
  sessionId: string;
  roomId: string;
  gameId: string;
  user1: OnlineUser;
  user2: OnlineUser;
};

export class GameStore {
  private games: Map<string, Game>;

  constructor() {
    this.games = new Map();
  }

  createGame({ sessionId, gameId, user1, user2, roomId }: CreateGameProps): Game {
    const newGame: Game = {
      sessionId,
      roomId,
      gameId,
      user1,
      user2,
      gameStatus: "requesting",
      moves: []
    };

    this.games.set(sessionId, newGame);
    return newGame;
  }

  getGame(sessionId: string): Game | undefined {
    return this.games.get(sessionId);
  }

  updateGameStatus(sessionId: string, status: GameStatus) {
    const game = this.games.get(sessionId);
    if (game) {
      game.gameStatus = status;
    }
  }

  addMove(sessionId: string, move: GameMove) {
    const game = this.games.get(sessionId);
    if (game) {
      game.moves.push(move);
    }
  }

  getMoves(sessionId: string): GameMove[] {
    const game = this.games.get(sessionId);
    return game ? game.moves : [];
  }

  removeGame(sessionId: string) {
    this.games.delete(sessionId);
  }

  findGameByUserId(userId: string): Game | undefined {
    for (const game of this.games.values()) {
      if (game.user1.personalCode === userId || game.user2.personalCode === userId) {
        return game;
      }
    }
    return undefined;
  }

  findGameByRoomId(roomId: string): Game | undefined {
    for (const game of this.games.values()) {
      if (game.roomId === roomId) {
        return game;
      }
    }
    return undefined;
  }
}

// Export singleton
export const gameStore = new GameStore();