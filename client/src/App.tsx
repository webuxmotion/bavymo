import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home";
import styles from './App.module.scss';
import clsx from "clsx";

function App() {
  return (
    <div className={clsx(styles.wrapper, "")}>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/about">About</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function About() {
  return <h1>ℹ️ About</h1>;
}
function Dashboard() {
  return <h1>📊 Dashboard</h1>;
}
function NotFound() {
  return <h1>404 - Not Found</h1>;
}

export default App;