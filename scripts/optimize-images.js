// Reduce y recomprime las fotos de src/assets/images.
//
// Uso:  npm run fotos
//
// - Lado más largo como máximo MAX_SIZE px (suficiente para
//   pantallas retina) y WebP con calidad QUALITY.
// - Solo sobrescribe si el resultado pesa menos.
// - Guarda antes una copia del original en ../fotos-originales
//   (fuera de la web, no se publica) si aún no existe.
// - Se puede ejecutar varias veces: las fotos ya optimizadas
//   se quedan como están.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const MAX_SIZE = 1600
const QUALITY = 80

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const imagesDir = path.join(root, 'src', 'assets', 'images')
const backupDir = path.resolve(root, '..', 'fotos-originales')

function listImages(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      return listImages(file)
    }

    return /\.webp$/i.test(entry.name) ? [file] : []
  })
}

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`

let before = 0
let after = 0

for (const file of listImages(imagesDir)) {
  const relative = path.relative(imagesDir, file)
  const original = fs.readFileSync(file)
  const { width, height } = await sharp(original).metadata()

  before += original.length

  const optimized = await sharp(original)
    .rotate()
    .resize({
      width: MAX_SIZE,
      height: MAX_SIZE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer({ resolveWithObject: true })

  if (optimized.data.length >= original.length) {
    after += original.length
    continue
  }

  const backup = path.join(backupDir, relative)

  if (!fs.existsSync(backup)) {
    fs.mkdirSync(path.dirname(backup), { recursive: true })
    fs.writeFileSync(backup, original)
  }

  fs.writeFileSync(file, optimized.data)
  after += optimized.data.length

  console.log(
    `${relative}  ${width}×${height} ${kb(original.length)}  →  ` +
      `${optimized.info.width}×${optimized.info.height} ${kb(optimized.data.length)}`
  )
}

console.log(`\nTotal: ${kb(before)}  →  ${kb(after)}`)
