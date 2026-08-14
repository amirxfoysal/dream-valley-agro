import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/index.js'
import { getInitialLang } from './i18n/index.js'
import { getInitialTheme } from './context/ThemeContext.jsx'
import App from './App.jsx'

document.documentElement.lang = getInitialLang()
document.documentElement.setAttribute('data-theme', getInitialTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
