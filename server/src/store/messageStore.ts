import { Message } from '../shared/types';

export class MessageStore {
  private messages: Map<string, Message[]>; // key = roomId, value = array of messages

  constructor() {
    this.messages = new Map();
  }

  addMessage(message: Message) {
    const { roomId } = message;

    if (!this.messages.has(roomId)) {
      this.messages.set(roomId, []);
    }

    const roomMessages = this.messages.get(roomId)!;
    roomMessages.push(message);
  }

  getMessagesByRoomId(roomId: string): Message[] {
    return this.messages.get(roomId) || [];
  }

  getMessageById(roomId: string, messageId: string): Message | undefined {
    const roomMessages = this.messages.get(roomId);
    if (!roomMessages) return undefined;

    return roomMessages.find(msg => msg.id === messageId);
  }

  removeMessage(roomId: string, messageId: string): boolean {
    const roomMessages = this.messages.get(roomId);
    if (!roomMessages) return false;

    const index = roomMessages.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      roomMessages.splice(index, 1);
      return true;
    }
    return false;
  }

  removeAllMessagesForRoom(roomId: string) {
    this.messages.delete(roomId);
  }
}

export const messageStore = new MessageStore();