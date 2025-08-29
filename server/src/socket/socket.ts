import { allowedOrigins } from "..";
import { Message } from "../shared/types";
import { messageStore } from "../store/messageStore";
import { roomStore } from "../store/roomStore";
import { userStore } from "../store/userStore";
import { Server } from "socket.io";
import { generateWord } from "../utils/generateWord";
import { Server as HttpServer } from "http";
import gameListeners from "./gameListeners";

type ServerData = {
  users: string[];
};

const userMap = new Map();
const serverData: ServerData = { users: [] };

const initSocket = ({ server }: { server: HttpServer }) => {
    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true
        }
    });

    io.on("connection", (socket) => {
  const cookies = socket.handshake.headers.cookie;
  let randomId = null;

  if (cookies) {
    const cookieObj = Object.fromEntries(
      cookies.split(';').map(c => c.trim().split('='))
    );
    randomId = cookieObj.randomId;
  }

  // Generate new randomId if missing
  if (!randomId) {
    randomId = generateWord();
    // send it to client to userStore as cookie
    socket.emit('setRandomId', randomId);
  }

  userStore.addUser(socket.id, randomId);

  const users = userStore.getAllUsers();

  io.emit("online-users", users);

  console.log("🔌 Client connected:", socket.id);

  socket.emit("personal-code", randomId);

  gameListeners({ socket, io });

  socket.on("webrtc-connected", () => {
    const room = roomStore.findRoomByParticipantSocketId(socket.id);
    const user = userStore.getUser(socket.id);

    if (room && user) {
      roomStore.pushToConnectedPair(room?.roomId, user);

      const connectedPair = roomStore.getConnectedPair(room?.roomId);

      if (connectedPair) {
        if (connectedPair.users.length === 2) {
          roomStore.updateCallStatus(room.roomId, "connected");

          const updatedRoom = roomStore.getRoom(room.roomId);

          io.to(connectedPair.users.map(p => p.socketId)).emit("room", updatedRoom);


        }
      }
    }
  });

  socket.on("start-call", (data) => {
    const { caller, callee } = data;

    const calleeUser = userStore.findByPersonalCode(callee);
    const callerUser = userStore.findByPersonalCode(caller);

    if (callerUser && calleeUser) {
      const room = roomStore.createRoom({ callee: calleeUser, caller: callerUser });

      if (room) {
        io.to(room.participants.map(p => p.socketId)).emit("room", room);
      }
    }
  });

  socket.on("end-call", ({ roomId }) => {
    roomStore.updateCallStatus(roomId, "ended");

    const room = roomStore.getRoom(roomId);

    if (room) {
      io.to(room.participants.map(p => p.socketId)).emit("room", room);
    }
  });

  socket.on("call-accept", ({ roomId }) => {
    roomStore.updateCallStatus(roomId, "accepted");

    const room = roomStore.getRoom(roomId);

    if (room) {
      io.to(room.participants.map(p => p.socketId)).emit("room", room);
    }
  });

  socket.on("call-reject", ({ roomId }) => {
    roomStore.updateCallStatus(roomId, "rejected");

    const room = roomStore.getRoom(roomId);

    if (room) {
      io.to(room.participants.map(p => p.socketId)).emit("room", room);
    }
  });

  socket.on("call-cancel", ({ roomId }) => {
    roomStore.updateCallStatus(roomId, "cancelled");

    const room = roomStore.getRoom(roomId);

    if (room) {
      io.to(room.participants.map(p => p.socketId)).emit("room", room);
    }
  });

  socket.on("message", ({ message }: { message: Message }) => {
    const room = roomStore.getRoom(message.roomId);

    if (room) {
      messageStore.addMessage(message);

      const messages = messageStore.getMessagesByRoomId(room.roomId);

      io.to(room.participants.map(p => p.socketId)).emit("messages", messages);
    }
  });

  socket.on("offer", ({ callee, caller, sdp }) => {
    const calleeUser = userStore.findByPersonalCode(callee);

    if (calleeUser) {
      socket.to(calleeUser.socketId).emit("offer", { sdp, caller, callee });
    }
  });

  socket.on("answer", ({ callee, caller, sdp }) => {
    const callerUser = userStore.findByPersonalCode(caller);

    if (callerUser) {
      socket.to(callerUser.socketId).emit("answer", { sdp, caller, callee });
    }
  });

  socket.on('signal', ({ to, data }) => {
    const toUser = userStore.findByPersonalCode(to);

    if (toUser) {
      io.to(toUser.socketId).emit('signal', { from: randomId, data });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    userStore.removeUser(socket.id);

    const onlineUsers = userStore.getAllUsers();
    io.emit("online-users", onlineUsers);

    userMap.delete(randomId);

    const usersArray = [...userMap.keys()];
    serverData.users = usersArray;
    io.emit('serverData', serverData);
  });
});
}

export default initSocket;
