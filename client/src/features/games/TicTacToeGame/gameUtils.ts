// gameUtils.ts
import type { Game } from "@server/shared/types";
import { winCombinations } from "./winCombinations";

export type SymbolType = "cross" | "zero";

export function parseMoves(moves: { content: string }[]): Record<number, SymbolType> {
  return moves.reduce<Record<number, SymbolType>>((acc, move) => {
    const [indexStr, symbol] = move.content.split("|");
    const index = Number(indexStr);

    if (!Number.isNaN(index) && (symbol === "cross" || symbol === "zero")) {
      acc[index] = symbol;
    }
    return acc;
  }, {});
}

export function checkIsYourTurn(game: Game, currentUserCode: string): boolean {
  const movesCount = game.moves.length;
  const isUser1Turn = movesCount % 2 === 0;
  return isUser1Turn
    ? currentUserCode === game.user1.personalCode
    : currentUserCode === game.user2.personalCode;
}

export function checkWinner(movesObj: Record<number, SymbolType>) {
  for (const [a, b, c] of winCombinations) {
    if (movesObj[a] && movesObj[a] === movesObj[b] && movesObj[a] === movesObj[c]) {
      return movesObj[a]; // "cross" or "zero"
    }
  }
  return null;
}

type PlayerInfo = {
  symbol: "cross" | "zero";
  personalCode: string;
};

export function getPlayersInfo(game: Game, currentUserCode: string): {
  you: PlayerInfo;
  opponent: PlayerInfo;
} {
  const yourSymbol = currentUserCode === game.user1.personalCode ? "cross" : "zero";
  const opponentSymbol = yourSymbol === "cross" ? "zero" : "cross";

  return {
    you: {
      symbol: yourSymbol,
      personalCode: currentUserCode,
    },
    opponent: {
      symbol: opponentSymbol,
      personalCode:
        game.user1.personalCode === currentUserCode
          ? game.user2.personalCode
          : game.user1.personalCode,
    },
  };
}