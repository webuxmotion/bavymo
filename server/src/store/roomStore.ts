import { CallStatus, ConnectedPair, Message, OnlineUser, Room } from '../shared/types';

type CreateRoomProps = {
  caller: OnlineUser;
  callee: OnlineUser;
}

export class RoomStore {
  private rooms: Map<string, Room>;
  private connectedPairs: Map<string, ConnectedPair>;

  constructor() {
    this.rooms = new Map();
    this.connectedPairs = new Map();
  }

  createRoom({ caller, callee }: CreateRoomProps): Room {
    const roomId = this.generateRoomId();
    const newRoom: Room = {
      roomId,
      callerId: caller.personalCode,
      calleeId: callee.personalCode,
      participants: [caller, callee],
      callStatus: "ringing",
      messages: [],
    };
    const connectedPair = {
      roomId,
      users: []
    }

    this.rooms.set(roomId, newRoom);
    this.connectedPairs.set(roomId, connectedPair);

    return newRoom;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  updateCallStatus(roomId: string, status: CallStatus) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.callStatus = status;
    }
  }

  addMessage(roomId: string, message: Message) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.messages.push(message);
    }
  }

  removeRoom(roomId: string) {
    this.rooms.delete(roomId);
  }

  findRoomByParticipantSocketId(socketId: string): Room | undefined {
    for (const room of this.rooms.values()) {
      if (room.participants.some(p => p.socketId === socketId)) {
        return room;
      }
    }
    return undefined;
  }

  pushToConnectedPair(roomId: string, user: OnlineUser) {
    const pair = this.connectedPairs.get(roomId);
    if (!pair) return;

    // Avoid duplicates
    const exists = pair.users.some(u => u.socketId === user.socketId);
    if (!exists) {
      pair.users.push(user);
    }
  }

  getConnectedPair(roomId: string): ConnectedPair | undefined {
    return this.connectedPairs.get(roomId);
  }

  removeConnectedPair(roomId: string) {
    this.connectedPairs.delete(roomId);
  }

  private generateRoomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export const roomStore = new RoomStore();