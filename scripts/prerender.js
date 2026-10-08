// Genera un HTML estático por cada ruta después de `vite build`.
//
// Los rastreadores de IA (GPTBot, ClaudeBot, PerplexityBot...) no
// ejecutan JavaScript: sin esto solo verían <div id="root"></div>.
// También genera sitemap.xml y llms.txt con los datos reales del catálogo.

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

function renderHead(seo) {
  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<link rel="canonical" href="${seo.url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Aroa López Sevilla" />`,
    `<meta property="og:locale" content="es_ES" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:url" content="${seo.url}" />`,
    `<meta property="og:image" content="${seo.image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json" id="structured-data">${safeJson(seo.jsonLd)}</script>`,
  ].join('\n    ')
}

function outputFile(route) {
  if (route === '/') {
    return path.join(distDir, 'index.html')
  }

  // Con "cleanUrls" en vercel.json, /coleccion sirve coleccion.html
  return path.join(distDir, `${route.slice(1)}.html`)
}

const site = getSiteData()
const today = new Date().toISOString().slice(0, 10)

// -----------------------------------------------------
// HTML POR RUTA
// -----------------------------------------------------

for (const route of site.routes) {
  const { html, seo } = await render(route)

  const page = template
    .replace('<!--app-head-->', renderHead(seo))
    .replace('<!--app-html-->', html)

  const file = outputFile(route)

  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, page)

  console.log(`prerender  ${route}  →  ${path.relative(root, file)}`)
}

// -----------------------------------------------------
// SITEMAP
// -----------------------------------------------------

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${site.routes
  .map(
    (route) => `  <url>
    <loc>${site.SITE_URL}${route === '/' ? '/' : route}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)

// -----------------------------------------------------
// LLMS.TXT  (https://llmstxt.org)
// -----------------------------------------------------

const { t, faqParams } = site

const STATUS = {
  disponible: 'disponible',
  proximamente: 'próximamente',
  vendida: 'vendida',
}

const llms = `# ${site.SITE_NAME}

> ${t('seo.organization')}

${t('faq.items.whatIs.answer', faqParams)} ${t('faq.items.where.answer', faqParams)} No hay dos piezas iguales: cuando una se vende, no se vuelve a hacer.

- Diseñadora: ${site.SITE_NAME} (Sevilla, España)
- Tipo de producto: tops reelaborados (upcycling), piezas únicas; blazers próximamente
- Precios: entre ${faqParams.min} € y ${faqParams.max} €
- Talla: aproximada S; medidas exactas bajo consulta
- Cómo comprar: botón «Consultar esta pieza» en cada ficha, formulario de contacto, email ${site.EMAIL} o Instagram @aroalopezsevilla (respuesta en 24-48 h)
- Idiomas de la web: español e inglés
- Última actualización: ${today}

## Páginas principales

- [Inicio](${site.SITE_URL}/): presentación de la marca y últimas piezas
- [Colección](${site.SITE_URL}/coleccion): catálogo completo con precio y disponibilidad
- [Sobre mí](${site.SITE_URL}/sobre-mi): quién es Aroa y cómo nace el proyecto
- [Preguntas frecuentes](${site.SITE_URL}/preguntas-frecuentes): precios, tallas, compra, upcycling y sostenibilidad
- [Contacto](${site.SITE_URL}/contacto): email, formulario e Instagram

## Colección actual

${site.products
  .map(
    (product) =>
      `- [Top ${product.name}](${site.SITE_URL}/producto/${product.id}): pieza única, ${product.price} €, ${STATUS[product.status]}`
  )
  .join('\n')}

## Preguntas frecuentes

${site.faqIds
  .map(
    (id) =>
      `### ${t(`faq.items.${id}.question`, faqParams)}\n\n${t(`faq.items.${id}.answer`, faqParams)}`
  )
  .join('\n\n')}

## Redes sociales

${site.SOCIAL_LINKS.map((link) => `- ${link}`).join('\n')}

## Optional

- [Política de privacidad](${site.SITE_URL}/politica-privacidad)
`

fs.writeFileSync(path.join(distDir, 'llms.txt'), llms)

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })

console.log('sitemap.xml y llms.txt generados')
