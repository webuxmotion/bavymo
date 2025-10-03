import { Router } from "express";
import { io } from "../socket/socket";   // we’ll use io to emit

const router = Router();

/**
 * POST /api/lilka
 * Body example: { temperature: 25, humidity: 60 }
 */
router.post("/", (req, res) => {
  const data = req.body;

  console.log("📡 Received from Lilka:", data);

  // Emit event to all connected clients
  io.emit("lilka-event", data);

  res.json({ status: "ok", received: data });
});

export default router;