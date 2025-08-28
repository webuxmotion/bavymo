export type OnlineUser = {
  socketId: string;
  personalCode: string;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: number;
};

export type CallStatus =
  | "idle"       // no call
  | "ringing"    // call exists, not answered yet
  | "accepted"   // user accept the call, it's time to create webrtc connection
  | "connected"  // call established, media flowing
  | "ended"      // call finished
  | "rejected"   // call declined
  | "cancelled"  // when caller cancel the outgoing call
  | "error";     // some failure occurred

export type Room = {
  participants: OnlineUser[];
  callerId: string;
  calleeId: string;
  roomId: string;
  callStatus: CallStatus;
  messages: Message[]
}

export type ConnectedPair = {
  roomId: string;
  users: OnlineUser[]
}