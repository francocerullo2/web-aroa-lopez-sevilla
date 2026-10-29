import { Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import RouteSeo from './components/RouteSeo'
import NewsletterPopup from './components/NewsletterPopup'
import { getPathLanguage } from './locale'
import { PAGES, notFoundPage as NotFound } from './routes'
import { revealOnScroll } from './reveal'

// Mantiene i18n sincronizado con el idioma de la URL
// (por ejemplo, al usar atrás/adelante del navegador).
function LanguageSync() {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()
  const language = getPathLanguage(pathname)

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }

    document.documentElement.lang = language
  }, [i18n, language])

  return null
}

// Prepara la aparición suave de secciones en cada página.
function ScrollReveal() {
  const { pathname } = useLocation()

  useEffect(() => {
    let cleanup = () => {}

    const frame = requestAnimationFrame(() => {
      cleanup = revealOnScroll()
    })

    return () => {
      cancelAnimationFrame(frame)
      cleanup()
    }
  }, [pathname])

  return null
}

// El router se aporta desde fuera: BrowserRouter en el
// navegador (main.jsx) y StaticRouter al prerenderizar
// (entry-server.jsx).
function App() {
  return (
    <>

      <ScrollToTop />

      <LanguageSync />

      <ScrollReveal />

      <RouteSeo />

      <Header />

      {/* Las páginas se cargan por separado (src/routes.jsx). */}
      <Suspense fallback={null}>
        <Routes>
          {PAGES.map(({ path, Page }) => (
            <Route key={path} path={path} element={<Page />} />
          ))}

          {PAGES.map(({ path, Page }) => (
            <Route
              key={`en${path}`}
              path={path === '/' ? '/en' : `/en${path}`}
              element={<Page />}
            />
          ))}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />

      <NewsletterPopup />

    </>
  )
}

export default App
