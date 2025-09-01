import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import styles from './App.module.scss';
import Header from "./components/Header/Header";
import CallModals from "./features/call/CallModals/CallModals";
import { useLocalVideo } from "./hooks/useLocalVideo";
import Home from "./pages/Home/Home";
import VideoChat from "./pages/VideoChat/VideoChat";
import { useRoomStore } from "./store/useRoomStore";
import GameModal from "./features/games/GameModal/GameModal";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";

function App() {
  const { initMedia } = useLocalVideo();
  const room = useRoomStore(s => s.room);

  useEffect(() => {
    initMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<>about</>} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/video-chat" element={<VideoChat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {room?.callStatus === "ringing" && <CallModals />}
      <GameModal />
    </div>
  );
}

function NotFound() {
  return <h1>404 - Not Found</h1>;
}

export default App;