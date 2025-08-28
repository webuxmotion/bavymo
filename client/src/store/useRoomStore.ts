import type { Room } from "@server/shared/types";
import { create } from "zustand";

type RoomStore = {
    room: Room | null;
    setRoom: (room: Room | null) => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
    room: null,
    setRoom: (room) => set({ room }),
}));