// store/useUsersStore.ts
import { create } from "zustand";
import type { OnlineUser } from "@server/shared/types";

type UsersStore = {
    users: OnlineUser[];
    setUsers: (users: OnlineUser[]) => void;
};

export const useUsersStore = create<UsersStore>((set) => ({
    users: [],
    setUsers: (users) => set({ users }),
}));