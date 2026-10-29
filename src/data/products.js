const productImages = import.meta.glob(
  '../assets/images/products/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  {
    eager: true,
    import: 'default',
  }
)

function getImagesByPrefix(prefix) {
  return Object.entries(productImages)
    .filter(([path]) => {
      const fileName = path.split('/').pop().toLowerCase()

      return fileName.startsWith(`${prefix.toLowerCase()}-`)
    })
    .sort(([pathA], [pathB]) => {
      const fileA = pathA.split('/').pop()
      const fileB = pathB.split('/').pop()

      return fileA.localeCompare(fileB, undefined, {
        numeric: true,
      })
    })
    .map(([, image]) => image)
}

function getProductImages(name) {
  return getImagesByPrefix(name)
}

// Cada pieza:
// - updatedAt: fecha de la última modificación real (precio,
//   estado, fotos o textos). Se usa en el sitemap y en los
//   datos estructurados: actualízala solo cuando cambie algo.
// - measurements: medidas reales, p. ej. 'Pecho 86 cm · Largo 42 cm'.
// - Descripción, material y color propios de cada pieza van en
//   src/locales (products.<id>.description / material / color).
//   Si faltan, se usa la descripción genérica.
const products = [
  {
    id: 1,
    name: 'Dolores',
    category: 'tops',
    images: getProductImages('Dolores'),
    status: 'disponible',
    price: 60,
    updatedAt: '2026-10-29',
    measurements: '',
  },
  {
    id: 2,
    name: 'Carmen',
    category: 'tops',
    images: getProductImages('Carmen'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-10-29',
    measurements: '',
  },
  {
    id: 3,
    name: 'Salina',
    category: 'tops',
    images: getProductImages('Salina'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-10-29',
    measurements: '',
  },
  {
    id: 4,
    name: 'Hechura',
    category: 'tops',
    images: getProductImages('Hechura'),
    status: 'disponible',
    price: 45,
    updatedAt: '2026-10-29',
    measurements: '',
  },
  {
    id: 5,
    name: 'Albero',
    category: 'tops',
    images: getProductImages('Albero'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-10-29',
    measurements: '',
  },
  {
    id: 6,
    name: 'Oliva',
    category: 'tops',
    images: getProductImages('Oliva'),
    status: 'disponible',
    price: 45,
    updatedAt: '2026-10-29',
    measurements: '',
  },
  {
    id: 7,
    name: 'Candela',
    category: 'tops',
    images: getProductImages('Candela'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-10-29',
    measurements: '',
  },
  {
    id: 8,
    name: 'Solera',
    category: 'tops',
    images: getProductImages('Solera'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-10-29',
    measurements: '',
  },
  {
    id: 9,
    name: 'Azahar',
    category: 'tops',
    images: getProductImages('Azahar'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-10-29',
    measurements: '',
  },
  {
    id: 10,
    name: 'Jara',
    category: 'tops',
    images: getProductImages('Jara'),
    status: 'disponible',
    price: 45,
    updatedAt: '2026-10-29',
    measurements: '',
  },
]

export default products
// Textos propios de una pieza en el idioma de `t`.
// Si no hay descripción propia, usa la genérica.
export function getProductInfo(product, t) {
  const text = (field) => {
    const key = `products.${product.id}.${field}`
    const value = t(key)

    return value === key ? '' : value
  }

  return {
    description: text('description') || t('product.description'),
    material: text('material'),
    color: text('color'),
    measurements: product.measurements,
  }
}
