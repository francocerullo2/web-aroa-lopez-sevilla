import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import i18n from './i18n'
import App from './App.jsx'
import { preloadPage } from './routes'
import products, { getProductInfo } from './data/products'
import { FAQ_IDS, getFaqParams } from './data/faq'
import { LANGUAGES, getPathLanguage, localizePath } from './locale'
import {
  getAllRoutes,
  getLocalizedRoutes,
  getAlternates,
  getLastModified,
  getPageSeo,
  SITE_URL,
  SITE_NAME,
  EMAIL,
  SOCIAL_LINKS,
} from './seo/site'

// Punto de entrada para el prerenderizado (scripts/prerender.js).
// El idioma de cada página sale de su URL (/en/... → inglés).

export async function render(url) {
  const language = getPathLanguage(url)

  await i18n.changeLanguage(language)
  await preloadPage(url)

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  )

  const seo = getPageSeo(url, i18n.getFixedT(language))

  return { html, seo }
}

export function getSiteData() {
  return {
    routes: getLocalizedRoutes(),
    baseRoutes: getAllRoutes(),
    languages: LANGUAGES,
    getAlternates,
    getLastModified,
    localizePath,
    products,
    getProductInfo,
    faqIds: FAQ_IDS,
    faqParams: getFaqParams(),
    t: i18n.getFixedT('es'),
    tEn: i18n.getFixedT('en'),
    SITE_URL,
    SITE_NAME,
    EMAIL,
    SOCIAL_LINKS,
  }
}
