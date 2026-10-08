import products from '../data/products'
import { FAQ_IDS, getFaqParams } from '../data/faq'
import logo from '../assets/images/brand/logo.png'

// =====================================================
// DATOS DEL SITIO
// =====================================================

export const SITE_URL = 'https://www.aroalopezsevilla.com'
export const SITE_NAME = 'Aroa López Sevilla'
export const EMAIL = 'aroalopezsevilla@gmail.com'

export const SOCIAL_LINKS = [
  'https://www.instagram.com/aroalopezsevilla',
  'https://www.tiktok.com/@aroalopezsevilla',
  'https://pin.it/E1l1a9iJR',
]

export const STATIC_ROUTES = [
  '/',
  '/coleccion',
  '/sobre-mi',
  '/preguntas-frecuentes',
  '/contacto',
  '/politica-privacidad',
]

export function getAllRoutes() {
  return [
    ...STATIC_ROUTES,
    ...products.map((product) => `/producto/${product.id}`),
  ]
}

export function absoluteUrl(path) {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
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

function organization(t) {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: absoluteUrl(logo),
    description: t('seo.organization'),
    email: EMAIL,
    founder: { '@id': PERSON_ID },
    foundingLocation: {
      '@type': 'Place',
      name: 'Sevilla, España',
    },
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
    homeLocation: {
      '@type': 'Place',
      name: 'Sevilla, España',
    },
    url: `${SITE_URL}/sobre-mi`,
    sameAs: SOCIAL_LINKS,
  }
}

function website(t, language) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: t('seo.home.description'),
    inLanguage: language,
    publisher: { '@id': ORGANIZATION_ID },
  }
}

function breadcrumb(url, items) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
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
    dateModified: new Date().toISOString().slice(0, 10),
    ...extra,
  }
}

function productSchema(product, t, language) {
  const url = absoluteUrl(`/producto/${product.id}`)

  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: t('seo.product.name', { name: product.name }),
    description: t('product.description'),
    image: product.images.map(absoluteUrl),
    url,
    sku: `ALS-${String(product.id).padStart(3, '0')}`,
    category: t('seo.product.category'),
    size: 'S',
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

export function getPageSeo(pathname, t, language = 'es') {
  const path = pathname.replace(/\/+$/, '') || '/'
  const url = absoluteUrl(path === '/' ? '/' : path)
  const params = getFaqParams()

  const home = { name: SITE_NAME, path: '/' }

  const base = [organization(t), person(t), website(t, language)]

  const build = ({ key, type, crumbs, extra = [], image, values = {} }) => {
    const title = t(`seo.${key}.title`, { ...params, ...values })
    const description = t(`seo.${key}.description`, { ...params, ...values })

    const page = webPage(type, url, title, description, language, {
      ...(crumbs ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    })

    const graph = [...base, page, ...extra]

    if (crumbs) {
      graph.push(breadcrumb(url, crumbs))
    }

    return {
      title,
      description,
      url,
      image: image ? absoluteUrl(image) : absoluteUrl(logo),
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
      extra: [
        {
          '@type': 'ItemList',
          name: t('seo.collection.title', params),
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteUrl(`/producto/${product.id}`),
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

  const productMatch = path.match(/^\/producto\/(\d+)$/)

  if (productMatch) {
    const product = products.find(
      (item) => item.id === Number(productMatch[1])
    )

    if (product) {
      const productName = t('seo.product.name', { name: product.name })

      return build({
        key: 'product',
        type: 'ItemPage',
        crumbs: [
          home,
          { name: t('header.collection'), path: '/coleccion' },
          { name: productName, path },
        ],
        image: product.images[0],
        values: { name: product.name, price: product.price },
        extra: [productSchema(product, t, language)],
      })
    }
  }

  return build({ key: 'home', type: 'WebPage' })
}
