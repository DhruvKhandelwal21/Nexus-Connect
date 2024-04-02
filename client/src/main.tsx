import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { SocketContextProvider } from './context/socketProvider.tsx'
import { JoinedUserContextProvider } from './context/joinedUsersProvider.tsx'
import { StreamProvider } from './context/streamProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <SocketContextProvider>
    <JoinedUserContextProvider>
    <StreamProvider>
    <App />
    </StreamProvider>
    </JoinedUserContextProvider>
    </SocketContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
