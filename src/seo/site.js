import products, { getProductInfo } from '../data/products'
import { FAQ_IDS, getFaqParams } from '../data/faq'
import { SOCIAL } from '../data/social'
import {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  getPathLanguage,
  stripLanguage,
  localizePath,
} from '../locale'
import logo from '../assets/images/brand/logo.png'
import shareImage from '../assets/images/brand/og-image.jpg'

// =====================================================
// DATOS DEL SITIO
// =====================================================

export const SITE_URL = 'https://www.aroalopezsevilla.com'
export const SITE_NAME = 'Aroa López Sevilla'
export const EMAIL = 'aroalopezsevilla@gmail.com'

export const SOCIAL_LINKS = Object.values(SOCIAL)

// Imagen para compartir en redes (WhatsApp, Instagram...) cuando
// la página no tiene una propia. 1200×630 px, en JPG para que
// la acepten todas las apps.
export const DEFAULT_SHARE_IMAGE = shareImage

// Fecha de la última modificación real de cada página
// estática. Actualízala solo cuando cambie su contenido:
// Google deja de fiarse de las fechas que cambian siempre.
const PAGE_UPDATED = {
  '/': '2026-10-29',
  '/coleccion': '2026-10-29',
  '/sobre-mi': '2026-10-29',
  '/preguntas-frecuentes': '2026-10-29',
  '/contacto': '2026-10-29',
  '/politica-privacidad': '2026-10-29',
}

export const STATIC_ROUTES = Object.keys(PAGE_UPDATED)

const OG_LOCALE = {
  es: 'es_ES',
  en: 'en_GB',
}

// Rutas sin prefijo de idioma.
export function getAllRoutes() {
  return [
    ...STATIC_ROUTES,
    ...products.map((product) => `/producto/${product.id}`),
  ]
}

// Todas las rutas de todos los idiomas, para prerenderizar.
export function getLocalizedRoutes() {
  return LANGUAGES.flatMap((language) =>
    getAllRoutes().map((route) => localizePath(route, language))
  )
}

export function absoluteUrl(path) {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

function latest(dates) {
  return dates.filter(Boolean).sort().at(-1)
}

const newestProduct = latest(products.map((product) => product.updatedAt))

// Fecha de última modificación de una ruta sin prefijo.
export function getLastModified(route) {
  const product = findProduct(route)

  if (product) {
    return product.updatedAt
  }

  // El Home y la colección muestran productos: cambian con ellos.
  if (route === '/' || route === '/coleccion') {
    return latest([PAGE_UPDATED[route], newestProduct])
  }

  return PAGE_UPDATED[route]
}

// URLs de la misma página en cada idioma (hreflang).
export function getAlternates(route) {
  return [
    ...LANGUAGES.map((language) => ({
      hreflang: language,
      href: absoluteUrl(localizePath(route, language)),
    })),
    {
      hreflang: 'x-default',
      href: absoluteUrl(localizePath(route, DEFAULT_LANGUAGE)),
    },
  ]
}

function findProduct(route) {
  const match = route.match(/^\/producto\/(\d+)$/)

  return match
    ? products.find((item) => item.id === Number(match[1]))
    : undefined
}

const AVAILABILITY = {
  disponible: 'https://schema.org/InStock',
  proximamente: 'https://schema.org/PreOrder',
  vendida: 'https://schema.org/SoldOut',
}

// =====================================================
// ENTIDADES (schema.org)
// =====================================================

const ORGANIZATION_ID = `${SITE_URL}/#organization`
const PERSON_ID = `${SITE_URL}/#aroa`
const WEBSITE_ID = `${SITE_URL}/#website`

const SEVILLA = {
  '@type': 'Place',
  name: 'Sevilla, España',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sevilla',
    addressRegion: 'Andalucía',
    addressCountry: 'ES',
  },
}

function organization(t) {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: absoluteUrl(logo),
    image: absoluteUrl(DEFAULT_SHARE_IMAGE),
    description: t('seo.organization'),
    email: EMAIL,
    founder: { '@id': PERSON_ID },
    foundingLocation: SEVILLA,
    address: SEVILLA.address,
    areaServed: 'ES',
    knowsAbout: t('seo.knowsAbout', { returnObjects: true }),
    sameAs: SOCIAL_LINKS,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: EMAIL,
      availableLanguage: ['es', 'en'],
    },
  }
}

function person(t) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE_NAME,
    givenName: 'Aroa',
    jobTitle: t('seo.jobTitle'),
    description: t('seo.person'),
    worksFor: { '@id': ORGANIZATION_ID },
    homeLocation: SEVILLA,
    url: `${SITE_URL}/sobre-mi`,
    sameAs: SOCIAL_LINKS,
  }
}

function website(t) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: t('seo.home.description'),
    inLanguage: LANGUAGES,
    publisher: { '@id': ORGANIZATION_ID },
  }
}

function breadcrumb(url, items, language) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizePath(item.path, language)),
    })),
  }
}

function webPage(type, url, title, description, language, extra = {}) {
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: language,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    ...extra,
  }
}

function productSchema(product, t, language) {
  const url = absoluteUrl(localizePath(`/producto/${product.id}`, language))
  const info = getProductInfo(product, t)
  const year = Number(product.updatedAt.slice(0, 4))

  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: t('seo.product.name', { name: product.name }),
    description: info.description,
    image: product.images.map(absoluteUrl),
    url,
    sku: `ALS-${String(product.id).padStart(3, '0')}`,
    category: t('seo.product.category'),
    size: 'S',
    ...(info.material ? { material: info.material } : {}),
    ...(info.color ? { color: info.color } : {}),
    // Pieza nueva, hecha con prendas reutilizadas.
    itemCondition: 'https://schema.org/NewCondition',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Upcycling',
        value: t('seo.product.upcycled'),
      },
      {
        '@type': 'PropertyValue',
        name: t('seo.product.uniqueLabel'),
        value: t('seo.product.uniqueValue'),
      },
      ...(info.measurements
        ? [{
            '@type': 'PropertyValue',
            name: t('product.details.measurements'),
            value: info.measurements,
          }]
        : []),
    ],
    inLanguage: language,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    manufacturer: { '@id': ORGANIZATION_ID },
    offers: {
      '@type': 'Offer',
      url,
      price: product.price.toFixed(2),
      priceCurrency: 'EUR',
      priceValidUntil: `${year + 1}-12-31`,
      itemCondition: 'https://schema.org/NewCondition',
      availability: AVAILABILITY[product.status],
      seller: { '@id': ORGANIZATION_ID },
    },
  }
}

export function faqSchema(t, ids = FAQ_IDS) {
  const params = getFaqParams()

  return {
    '@type': 'FAQPage',
    mainEntity: ids.map((id) => ({
      '@type': 'Question',
      name: t(`faq.items.${id}.question`, params),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`faq.items.${id}.answer`, params),
      },
    })),
  }
}

// =====================================================
// SEO POR RUTA
// =====================================================

// `t` debe estar en el idioma de la URL (getPathLanguage).
export function getPageSeo(pathname, t) {
  const fullPath = pathname.replace(/\/+$/, '') || '/'
  const language = getPathLanguage(fullPath)
  const path = stripLanguage(fullPath)
  const url = absoluteUrl(localizePath(path, language))
  const params = getFaqParams()

  const home = { name: SITE_NAME, path: '/' }

  const base = [organization(t), person(t), website(t)]

  const build = ({
    key,
    type,
    crumbs,
    extra = [],
    image,
    imageAlt,
    ogType = 'website',
    values = {},
  }) => {
    const title = t(`seo.${key}.title`, { ...params, ...values })
    const description = t(`seo.${key}.description`, { ...params, ...values })
    const lastModified = getLastModified(path)

    const page = webPage(type, url, title, description, language, {
      ...(lastModified ? { dateModified: lastModified } : {}),
      ...(crumbs ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    })

    const graph = [...base, page, ...extra]

    if (crumbs) {
      graph.push(breadcrumb(url, crumbs, language))
    }

    return {
      title,
      description,
      url,
      path,
      language,
      locale: OG_LOCALE[language],
      alternateLocales: LANGUAGES
        .filter((item) => item !== language)
        .map((item) => OG_LOCALE[item]),
      alternates: getAlternates(path),
      lastModified,
      noindex: false,
      ogType,
      image: absoluteUrl(image || DEFAULT_SHARE_IMAGE),
      imageAlt: imageAlt || t('seo.shareImageAlt'),
      jsonLd: { '@context': 'https://schema.org', '@graph': graph },
    }
  }

  if (path === '/') {
    return build({ key: 'home', type: 'WebPage' })
  }

  if (path === '/coleccion') {
    return build({
      key: 'collection',
      type: 'CollectionPage',
      crumbs: [home, { name: t('header.collection'), path }],
      image: products[0]?.images[0],
      imageAlt: t('product.imageAlt', { name: products[0]?.name }),
      extra: [
        {
          '@type': 'ItemList',
          name: t('seo.collection.title', params),
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteUrl(localizePath(`/producto/${product.id}`, language)),
            name: t('seo.product.name', { name: product.name }),
          })),
        },
      ],
    })
  }

  if (path === '/sobre-mi') {
    return build({
      key: 'about',
      type: 'AboutPage',
      crumbs: [home, { name: t('header.about'), path }],
    })
  }

  if (path === '/preguntas-frecuentes') {
    const result = build({
      key: 'faq',
      type: 'FAQPage',
      crumbs: [home, { name: t('faq.title'), path }],
    })

    // La propia página es el FAQPage: le añadimos las preguntas.
    const page = result.jsonLd['@graph'].find(
      (node) => node['@id'] === `${url}#webpage`
    )

    page.mainEntity = faqSchema(t).mainEntity

    return result
  }

  if (path === '/contacto') {
    return build({
      key: 'contact',
      type: 'ContactPage',
      crumbs: [home, { name: t('header.contact'), path }],
    })
  }

  if (path === '/politica-privacidad') {
    return build({
      key: 'privacy',
      type: 'WebPage',
      crumbs: [home, { name: t('privacy.title'), path }],
    })
  }

  const product = findProduct(path)

  if (product) {
    const productName = t('seo.product.name', { name: product.name })

    return build({
      key: 'product',
      type: 'ItemPage',
      ogType: 'product',
      crumbs: [
        home,
        { name: t('header.collection'), path: '/coleccion' },
        { name: productName, path },
      ],
      image: product.images[0],
      imageAlt: t('product.imageAlt', { name: product.name }),
      values: { name: product.name, price: product.price },
      extra: [productSchema(product, t, language)],
    })
  }

  // Ruta inexistente: no se indexa ni tiene canonical.
  return {
    title: t('seo.notFound.title'),
    description: t('seo.notFound.description'),
    url: null,
    path,
    language,
    locale: OG_LOCALE[language],
    alternateLocales: [],
    alternates: [],
    lastModified: null,
    noindex: true,
    ogType: 'website',
    image: absoluteUrl(DEFAULT_SHARE_IMAGE),
    imageAlt: t('seo.shareImageAlt'),
    jsonLd: null,
  }
}
