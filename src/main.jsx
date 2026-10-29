import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource-variable/jost/index.css'
import './index.css'
import './styles/Interactions.css'
import './i18n'
import App from './App.jsx'
import { preloadPage, preloadAllPages } from './routes'

// Primero se carga el código de la página actual (así se pinta
// sin parpadeos sobre el HTML prerenderizado) y, cuando el
// navegador está libre, el del resto de páginas.
preloadPage(window.location.pathname).finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )

  const idle = window.requestIdleCallback || ((callback) => setTimeout(callback, 2000))

  idle(() => {
    preloadAllPages()
  })
})
