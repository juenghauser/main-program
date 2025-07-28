import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Disable StrictMode for single invocation of useEffect (simulates production)
createRoot(document.getElementById('root')).render(
  <App />
);
