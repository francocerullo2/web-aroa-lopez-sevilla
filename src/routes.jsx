import { lazy } from 'react'
import { matchRoutes } from 'react-router-dom'
import { stripLanguage } from './locale'

// =====================================================
// PÁGINAS (cada una en su propio archivo JS)
// =====================================================
// Así el navegador solo descarga el código de la página que
// se visita. Antes de pintar (main.jsx) y al prerenderizar
// (entry-server.jsx) se precarga la página de la URL, para
// que el HTML no parpadee ni salga vacío.

function lazyPage(load) {
  let Loaded = null

  const preload = () =>
    load().then((module) => {
      Loaded = module.default
    })

  const Lazy = lazy(load)

  function Page(props) {
    return Loaded ? <Loaded {...props} /> : <Lazy {...props} />
  }

  Page.preload = preload

  return Page
}

const Home = lazyPage(() => import('./pages/Home'))
const Collection = lazyPage(() => import('./pages/Collection'))
const Product = lazyPage(() => import('./pages/Product'))
const About = lazyPage(() => import('./pages/About'))
const Faq = lazyPage(() => import('./pages/Faq'))
const Contact = lazyPage(() => import('./pages/Contact'))
const PrivacyPolicy = lazyPage(() => import('./pages/PrivacyPolicy'))
const NotFound = lazyPage(() => import('./pages/NotFound'))

export const PAGES = [
  { path: '/', Page: Home },
  { path: '/coleccion', Page: Collection },
  { path: '/producto/:id', Page: Product },
  { path: '/sobre-mi', Page: About },
  { path: '/preguntas-frecuentes', Page: Faq },
  { path: '/contacto', Page: Contact },
  { path: '/politica-privacidad', Page: PrivacyPolicy },
]

// Página 404 (ruta "*").
export const notFoundPage = NotFound

// Carga el código de la página que corresponde a una URL.
export function preloadPage(pathname) {
  const match = matchRoutes(
    PAGES.map(({ path }) => ({ path })),
    stripLanguage(pathname)
  )

  const page = match
    ? PAGES.find(({ path }) => path === match[0].route.path)
    : null

  return (page ? page.Page : NotFound).preload()
}

// Carga en segundo plano el resto de páginas.
export function preloadAllPages() {
  return Promise.all([
    ...PAGES.map(({ Page }) => Page.preload()),
    NotFound.preload(),
  ])
}
