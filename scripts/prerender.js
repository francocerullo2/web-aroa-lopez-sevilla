// Genera un HTML estático por cada ruta y cada idioma después
// de `vite build`.
//
// Los rastreadores de IA (GPTBot, ClaudeBot, PerplexityBot...) no
// ejecutan JavaScript: sin esto solo verían <div id="root"></div>.
// También genera 404.html, sitemap.xml (con hreflang) y llms.txt
// con los datos reales del catálogo.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const serverEntry = path.join(root, 'dist-ssr', 'entry-server.js')

const { render, getSiteData } = await import(pathToFileURL(serverEntry).href)

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// Evita que un "</script>" dentro del JSON cierre la etiqueta.
const safeJson = (data) => JSON.stringify(data).replace(/</g, '\\u003c')

// -----------------------------------------------------
// MEDIDAS DE IMAGEN (para og:image:width / height)
// -----------------------------------------------------

function readImageSize(file) {
  const buffer = fs.readFileSync(file)

  // PNG
  if (buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
  }

  // WebP
  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    const chunk = buffer.toString('ascii', 12, 16)

    if (chunk === 'VP8X') {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      }
    }

    if (chunk === 'VP8 ') {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      }
    }

    if (chunk === 'VP8L') {
      const bits = buffer.readUInt32LE(21)

      return {
        width: 1 + (bits & 0x3fff),
        height: 1 + ((bits >> 14) & 0x3fff),
      }
    }
  }

  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2

    while (offset < buffer.length) {
      const marker = buffer[offset + 1]
      const length = buffer.readUInt16BE(offset + 2)

      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        }
      }

      offset += 2 + length
    }
  }

  return null
}

function imageSize(url, siteUrl) {
  if (!url.startsWith(siteUrl)) {
    return null
  }

  const file = path.join(distDir, url.slice(siteUrl.length))

  return fs.existsSync(file) ? readImageSize(file) : null
}

// -----------------------------------------------------
// <head> POR PÁGINA
// -----------------------------------------------------

function renderHead(seo, siteUrl) {
  const size = imageSize(seo.image, siteUrl)

  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    seo.noindex
      ? `<meta name="robots" content="noindex, follow" />`
      : `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    seo.url && `<link rel="canonical" href="${seo.url}" />`,
    ...seo.alternates.map(
      ({ hreflang, href }) =>
        `<link rel="alternate" hreflang="${hreflang}" href="${href}" />`
    ),
    `<meta property="og:type" content="${seo.ogType}" />`,
    `<meta property="og:site_name" content="Aroa López Sevilla" />`,
    `<meta property="og:locale" content="${seo.locale}" />`,
    ...seo.alternateLocales.map(
      (locale) => `<meta property="og:locale:alternate" content="${locale}" />`
    ),
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    seo.url && `<meta property="og:url" content="${seo.url}" />`,
    `<meta property="og:image" content="${seo.image}" />`,
    size && `<meta property="og:image:width" content="${size.width}" />`,
    size && `<meta property="og:image:height" content="${size.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${seo.image}" />`,
    seo.jsonLd &&
      `<script type="application/ld+json" id="structured-data">${safeJson(seo.jsonLd)}</script>`,
  ]

  return tags.filter(Boolean).join('\n    ')
}

function outputFile(route) {
  if (route === '/') {
    return path.join(distDir, 'index.html')
  }

  // Con "cleanUrls" en vercel.json, /coleccion sirve coleccion.html
  // y /en sirve en.html
  return path.join(distDir, `${route.slice(1)}.html`)
}

async function writePage(route, file) {
  const { html, seo } = await render(route)

  const page = template
    .replace('<html lang="es">', `<html lang="${seo.language}">`)
    .replace('<!--app-head-->', renderHead(seo, site.SITE_URL))
    .replace('<!--app-html-->', html)

  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, page)

  console.log(`prerender  ${route}  →  ${path.relative(root, file)}`)
}

const site = getSiteData()

// -----------------------------------------------------
// HTML POR RUTA E IDIOMA
// -----------------------------------------------------

for (const route of site.routes) {
  await writePage(route, outputFile(route))
}

// Vercel sirve 404.html con estado 404 para cualquier URL
// que no exista (y lleva noindex).
await writePage('/404', path.join(distDir, '404.html'))

// -----------------------------------------------------
// SITEMAP (con versiones por idioma)
// -----------------------------------------------------

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${site.languages
  .flatMap((language) =>
    site.baseRoutes.map((route) => {
      const alternates = site
        .getAlternates(route)
        .map(
          ({ hreflang, href }) =>
            `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`
        )
        .join('\n')

      return `  <url>
    <loc>${site.SITE_URL}${site.localizePath(route, language)}</loc>
    <lastmod>${site.getLastModified(route)}</lastmod>
${alternates}
  </url>`
    })
  )
  .join('\n')}
</urlset>
`

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)

// -----------------------------------------------------
// LLMS.TXT  (https://llmstxt.org)
// -----------------------------------------------------

const { t, tEn, faqParams } = site

const STATUS = {
  disponible: 'disponible',
  proximamente: 'próximamente',
  vendida: 'vendida',
}

const lastUpdated = site.products
  .map((product) => product.updatedAt)
  .concat(site.baseRoutes.map(site.getLastModified))
  .filter(Boolean)
  .sort()
  .at(-1)

function productLine(product) {
  const info = site.getProductInfo(product, t)

  const extras = [
    info.material && `material: ${info.material}`,
    info.color && `color: ${info.color}`,
    info.measurements && `medidas: ${info.measurements}`,
  ].filter(Boolean)

  return `- [Top ${product.name}](${site.SITE_URL}/producto/${product.id}): pieza única, ${product.price} €, ${STATUS[product.status]}${
    extras.length ? `, ${extras.join(', ')}` : ''
  }`
}

const llms = `# ${site.SITE_NAME}

> ${t('seo.organization')}

Aroa López Sevilla es una marca de moda de Sevilla (España) creada por la diseñadora Aroa. Cada pieza se diseña y se confecciona a mano en Sevilla transformando prendas de segunda mano: se selecciona, se descose, se corta y se vuelve a construir. No hay dos piezas iguales: cuando una se vende, no se vuelve a hacer.

- Diseñadora: ${site.SITE_NAME} (Sevilla, España)
- Tipo de producto: tops reelaborados (upcycling), piezas únicas; blazers próximamente
- Precios: entre ${faqParams.min} € y ${faqParams.max} €
- Talla: aproximada S; medidas exactas bajo consulta
- Cómo comprar: botón «Consultar esta pieza» en cada ficha, formulario de contacto, email ${site.EMAIL} o Instagram @aroalopezsevilla (respuesta en 24-48 h)
- Idiomas de la web: español (${site.SITE_URL}/) e inglés (${site.SITE_URL}/en)
- Última actualización: ${lastUpdated}

## Páginas principales

- [Inicio](${site.SITE_URL}/): presentación de la marca y últimas piezas
- [Colección](${site.SITE_URL}/coleccion): catálogo completo con precio y disponibilidad
- [Sobre mí](${site.SITE_URL}/sobre-mi): quién es Aroa y cómo nace el proyecto
- [Preguntas frecuentes](${site.SITE_URL}/preguntas-frecuentes): precios, tallas, compra, upcycling y sostenibilidad
- [Contacto](${site.SITE_URL}/contacto): email, formulario e Instagram

## Colección actual

${site.products.map(productLine).join('\n')}

## Preguntas frecuentes

${site.faqIds
  .map(
    (id) =>
      `### ${t(`faq.items.${id}.question`, faqParams)}\n\n${t(`faq.items.${id}.answer`, faqParams)}`
  )
  .join('\n\n')}

## English

> ${tEn('seo.organization')}

- [Home](${site.SITE_URL}/en): the brand and latest pieces
- [Collection](${site.SITE_URL}/en/coleccion): full catalogue with prices and availability
- [About](${site.SITE_URL}/en/sobre-mi): who Aroa is and how the project started
- [FAQ](${site.SITE_URL}/en/preguntas-frecuentes): prices, sizes, how to buy, upcycling
- [Contact](${site.SITE_URL}/en/contacto)

## Redes sociales

${site.SOCIAL_LINKS.map((link) => `- ${link}`).join('\n')}

## Optional

- [Política de privacidad](${site.SITE_URL}/politica-privacidad)
`

fs.writeFileSync(path.join(distDir, 'llms.txt'), llms)

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })

console.log('404.html, sitemap.xml y llms.txt generados')
