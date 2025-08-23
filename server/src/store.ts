import { OnlineUser } from "./shared/types";

export class Store {
    private onlineUsers: Map<string, OnlineUser>; // key = socketId

    constructor() {
        this.onlineUsers = new Map();
    }

    addUser(socketId: string, personalCode: string) {
        this.onlineUsers.set(socketId, { socketId, personalCode });
    }

    removeUser(socketId: string) {
        this.onlineUsers.delete(socketId);
    }

    getUser(socketId: string): OnlineUser | undefined {
        return this.onlineUsers.get(socketId);
    }

    getAllUsers(): OnlineUser[] {
        return Array.from(this.onlineUsers.values());
    }

    findByPersonalCode(code: string): OnlineUser | undefined {
        return Array.from(this.onlineUsers.values()).find(
            (user) => user.personalCode.toUpperCase() === code.toUpperCase()
        );
    }
}

// singleton instance for global usage
export const store = new Store();