import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import "./main.css"
import "./styles/main.scss"
import { SocketProvider } from './modules/socket/SocketProvider.tsx';
import { ChatProvider } from './modules/chat/ChatProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
)
