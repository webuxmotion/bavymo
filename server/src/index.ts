import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import cors from "cors";
import { generateWord } from "./utils/generateWord";
import { store } from "./store";

const app = express();
app.use(cors());

app.get("/server-test", (_req, res) => {
  res.send("Server is running ✅");
});

// Only serve React build in production
if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "../../client/dist");

  // Serve static files
  app.use(express.static(clientDistPath));

  // SPA fallback for all other routes
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.get("/server-test", (_req, res) => {
  res.send("Server is running ✅");
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  const personalCode = generateWord();
  store.addUser(socket.id, personalCode);

  socket.emit("personal-code", personalCode);

  const onlineUsers = store.getAllUsers();
  io.emit("online-users", onlineUsers);

  socket.on("message", (msg: string) => {
    console.log("💬 Message:", msg);
    socket.emit("message", `Server received: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    store.removeUser(socket.id);

    console.log(store.getAllUsers());
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
