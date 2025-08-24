import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import "./main.css"
import "./styles/main.scss"
import { SocketProvider } from './providers/SocketProvider.tsx';
import { AppProvider } from './providers/AppProvider.tsx';
import { AudioProvider } from './providers/AudioProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppProvider>
      <SocketProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </SocketProvider>
    </AppProvider>
  </BrowserRouter>
)