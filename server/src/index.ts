import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import path from "path";

import { generateWord } from "./utils/generateWord";
import initSocket from "./socket/socket";

const app = express();
app.use(cookieParser());
export const allowedOrigins = [
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

initSocket({ server });

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
