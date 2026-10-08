import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import i18n from './i18n'
import App from './App.jsx'
import products from './data/products'
import { FAQ_IDS, getFaqParams } from './data/faq'
import { getAllRoutes, getPageSeo, SITE_URL, SITE_NAME, EMAIL, SOCIAL_LINKS } from './seo/site'

// Punto de entrada para el prerenderizado (scripts/prerender.js).
// El HTML se genera en español, el idioma principal de la web.

export async function render(url) {
  await i18n.changeLanguage('es')

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  )

  const seo = getPageSeo(url, i18n.getFixedT('es'), 'es')

  return { html, seo }
}

export function getSiteData() {
  return {
    routes: getAllRoutes(),
    products,
    faqIds: FAQ_IDS,
    faqParams: getFaqParams(),
    t: i18n.getFixedT('es'),
    SITE_URL,
    SITE_NAME,
    EMAIL,
    SOCIAL_LINKS,
  }
}
