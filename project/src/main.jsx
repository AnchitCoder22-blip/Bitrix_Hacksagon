import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SystemProvider } from './context/SystemContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SystemProvider>
      <App />
    </SystemProvider>
  </StrictMode>,
)
