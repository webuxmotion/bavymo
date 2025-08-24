import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import styles from './App.module.scss';
import Header from "./components/Header/Header";
import VideoChat from "./pages/VideoChat/VideoChat";
import { useLocalVideo } from "./hooks/useLocalVideo";
import { useEffect } from "react";
import CallModals from "./features/call/CallModals/CallModals";

function App() {
  const { initMedia } = useLocalVideo();

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
        <Route path="/video-chat" element={<VideoChat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <CallModals />
    </div>
  );
}

function NotFound() {
  return <h1>404 - Not Found</h1>;
}

export default App;