import type { Game } from "@server/shared/types";
import { create } from "zustand";

type GameStore = {
    game: Game | null;
    setGame: (game: Game | null) => void;
};

export const useGameStore = create<GameStore>((set) => ({
    game: null,
    setGame: (game) => set({ game }),
}));