import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { generateWord } from "./utils/generateWord";
import { store } from "./store";

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

  // SPA fallback for all other routes
  // app.get(/.*/, (_req, res) => {
  //   res.sendFile(path.join(clientDistPath, "index.html"));
  // });
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
    // send it to client to store as cookie
    socket.emit('setRandomId', randomId);
  }

  // Store mapping
  userMap.set(randomId, socket.id);

  const usersArray = [...userMap.keys()];
  serverData.users = usersArray;
  io.emit('serverData', serverData);


  console.log("🔌 Client connected:", socket.id);

  // const personalCode = generateWord();
  // store.addUser(socket.id, personalCode);

  socket.emit("personal-code", randomId);

  // const onlineUsers = store.getAllUsers();
  // io.emit("online-users", onlineUsers);

  socket.on("call", (data) => {
    const { caller, callee } = data;

    const calleeUser = userMap.get(callee.toUpperCase());
    const callerUser = userMap.get(caller.toUpperCase());

    if (calleeUser && callerUser) {
      socket.to(calleeUser).emit("call", {
        callerUser: {
          personalCode: caller,
          socketId: callerUser
        }
      });
    }
  });

  socket.on("offer", ({ callee, caller, sdp }) => {
    const calleeUser = userMap.get(callee);

    if (calleeUser) {
      socket.to(calleeUser.socketId).emit("offer", { sdp, caller, callee });
    }
  });

  socket.on("answer", ({ callee, caller, sdp }) => {
    const callerUser = userMap.get(caller);

    if (callerUser) {
      socket.to(callerUser.socketId).emit("answer", { sdp, caller, callee });
    }
  });

  // socket.on('signal', ({ to, data }) => {
  //   const targetUser = userMap.get(to);

  //   if (targetUser) {
  //     io.to(targetUser.socketId).emit('signal', { from: to, data });
  //   }
  // });

  // Signaling for WebRTC
  socket.on('signal', ({ to, data }) => {

    const targetSocketId = userMap.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit('signal', { from: randomId, data });
    }
  });

  socket.on("call-accept", ({ caller, callee }) => {
    const callerUser = userMap.get(caller);

    console.log('callerUser', callerUser);

    if (callerUser) {
      socket.to(callerUser).emit("call-accept", { callee, caller });
    }
  });

  socket.on("call-reject", ({ callerUser }) => {
    socket.to(callerUser.socketId).emit("call-reject");
  });

  socket.on("cancel-call", (data) => {
    const calleeUser = userMap.get(data);

    if (calleeUser) {
      socket.to(calleeUser.socketId).emit("cancel-call");
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    store.removeUser(socket.id);

    const onlineUsers = store.getAllUsers();
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
