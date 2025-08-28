import { OnlineUser, Room, CallStatus, Message } from '../shared/types';

type CreateRoomProps = {
    caller: OnlineUser;
    callee: OnlineUser;
}

export class RoomStore {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
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

    this.rooms.set(roomId, newRoom);
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

  private generateRoomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export const roomStore = new RoomStore();