import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { roomStore } from "./store/roomStore";
import { userStore } from "./store/userStore";
import { generateWord } from "./utils/generateWord";

const app = express();
app.use(cookieParser());
const allowedOrigins = [
  "https://bavymo.com",
  "https://www.bavymo.com",
];

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push("http://localhost:5173");
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.get("/server-test", (_req, res) => {
  res.send("Server is running ✅");
});

app.get('/api/get-random-id', (req, res) => {
  let randomId = req.cookies?.randomId;

  if (!randomId) {
    randomId = generateWord();
    res.cookie('randomId', randomId, {
      maxAge: 120000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true only in prod
      path: '/',
    });
  }
  res.json({ randomId });
});

// Only serve React build in production
if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "../../client/dist");

  // Serve static files
  app.use(express.static(clientDistPath));

  app.get(/^\/(?!api|socket).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.get("/server-test", (_req, res) => {
  res.send("Server is running ✅");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

type ServerData = {
  users: string[];
};

const userMap = new Map();
const serverData: ServerData = { users: [] };

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

  socket.on("start-call", (data) => {
    const { caller, callee } = data;

    const calleeUser = userStore.findByPersonalCode(callee);
    const callerUser = userStore.findByPersonalCode(caller);

    if (callerUser && calleeUser) {
      const room = roomStore.createRoom({ callee: calleeUser, caller: callerUser });

      io.to(callerUser.socketId).emit("room", room);
      io.to(calleeUser.socketId).emit("room", room);
    }
  });

  socket.on("call-accept", ({ roomId }) => {
    roomStore.updateCallStatus(roomId, "accepted");

    const room = roomStore.getRoom(roomId);

    if (room) {
      io.to(room.participants.map(p => p.socketId)).emit("room", room);
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

  socket.on("call-reject", ({ caller }) => {
    const callerUser = userStore.findByPersonalCode(caller);

    if (callerUser) {
      socket.to(callerUser.socketId).emit("call-reject");
    }
  });

  socket.on("cancel-call", (data) => {
    const calleeUser = userStore.findByPersonalCode(data);

    if (calleeUser) {
      socket.to(calleeUser.socketId).emit("cancel-call");
    }
  });

  socket.on("user-hanged-up", ({ targetCode }) => {
    const targetUser = userStore.findByPersonalCode(targetCode);

    if (targetUser) {
      socket.to(targetUser.socketId).emit("user-hanged-up");
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

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
