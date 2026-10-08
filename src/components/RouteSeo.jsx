import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPageSeo } from '../seo/site'

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

// Mantiene título, metas y datos estructurados al navegar.
// El HTML inicial de cada ruta ya los trae prerenderizados
// (scripts/prerender.js) para los rastreadores sin JavaScript.
function RouteSeo() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const language = i18n.language?.startsWith('en') ? 'en' : 'es'
    const seo = getPageSeo(pathname, t, language)

    document.documentElement.lang = language
    document.title = seo.title

    setMeta('name', 'description', seo.description)
    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('property', 'og:url', seo.url)
    setMeta('property', 'og:image', seo.image)

    let canonical = document.head.querySelector('link[rel="canonical"]')

    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }

    canonical.href = seo.url

    let structuredData = document.getElementById('structured-data')

    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.type = 'application/ld+json'
      structuredData.id = 'structured-data'
      document.head.appendChild(structuredData)
    }

    structuredData.textContent = JSON.stringify(seo.jsonLd)
  }, [pathname, t, i18n.language])

  return null
}

export default RouteSeo
