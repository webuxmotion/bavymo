import { useEffect } from "react";
import clsx from "clsx";
import { io } from "socket.io-client";
import LogoBig from "./icons/LogoBig";
import Waves from "./components/Waves";
import styles from './App.module.scss';

function App() {
  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
      socket.emit("message", "Hello from client!");
    });

    socket.on("message", (msg) => {
      console.log("📩 From server:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={clsx(styles.wrapper, "pb-20")}>
      <h1 className="">Bavymo - video chat with games!</h1>
      <div className={styles.logo}>
        <LogoBig />
      </div>
      <div className={styles.waves}>
        <Waves />
      </div>
    </div>
  );
}

export default App;