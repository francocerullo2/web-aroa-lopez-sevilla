import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPageSeo } from '../seo/site'
import { getPathLanguage } from '../locale'

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)

  if (!content) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function setCanonical(url) {
  let canonical = document.head.querySelector('link[rel="canonical"]')

  if (!url) {
    canonical?.remove()
    return
  }

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }

  canonical.href = url
}

function setAlternates(alternates) {
  document.head
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((element) => element.remove())

  alternates.forEach(({ hreflang, href }) => {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = hreflang
    link.href = href
    document.head.appendChild(link)
  })
}

// Mantiene título, metas y datos estructurados al navegar.
// El HTML inicial de cada ruta ya los trae prerenderizados
// (scripts/prerender.js) para los rastreadores sin JavaScript.
function RouteSeo() {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    const language = getPathLanguage(pathname)
    const seo = getPageSeo(pathname, i18n.getFixedT(language))

    document.documentElement.lang = language
    document.title = seo.title

    setMeta('name', 'description', seo.description)
    setMeta('name', 'robots', seo.noindex
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large, max-snippet:-1')

    setMeta('property', 'og:type', seo.ogType)
    setMeta('property', 'og:locale', seo.locale)
    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('property', 'og:url', seo.url)
    setMeta('property', 'og:image', seo.image)
    setMeta('property', 'og:image:alt', seo.imageAlt)
    // Las medidas solo se conocen al compilar.
    setMeta('property', 'og:image:width', null)
    setMeta('property', 'og:image:height', null)

    setMeta('name', 'twitter:title', seo.title)
    setMeta('name', 'twitter:description', seo.description)
    setMeta('name', 'twitter:image', seo.image)

    setCanonical(seo.url)
    setAlternates(seo.alternates)

    let structuredData = document.getElementById('structured-data')

    if (!seo.jsonLd) {
      structuredData?.remove()
      return
    }

    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.type = 'application/ld+json'
      structuredData.id = 'structured-data'
      document.head.appendChild(structuredData)
    }

    structuredData.textContent = JSON.stringify(seo.jsonLd)
  }, [pathname, i18n])

  return null
}

export default RouteSeo
