import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import styles from './App.module.scss';
import Header from "./components/Header/Header";
import VideoChat from "./pages/VideoChat/VideoChat";

function App() {
  return (
    <div className={styles.wrapper}>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/video-chat" element={<VideoChat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function About() {
  return <h1>ℹ️ About</h1>;
}
function NotFound() {
  return <h1>404 - Not Found</h1>;
}

export default App;