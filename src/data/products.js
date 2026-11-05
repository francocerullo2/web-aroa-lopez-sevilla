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
// - isNew: aparece en "Novedades" del Home. Al salir un drop nuevo,
//   se quita de las piezas anteriores.
// - size: talla que se muestra en la ficha.
// - measurements: medidas reales, p. ej. 'Pecho 86 cm · Largo 42 cm'.
// - Descripción, material y color propios de cada pieza van en
//   src/locales (products.<id>.description / material / color / pattern).
//   Si faltan, se usa la descripción genérica.
const products = [
  // Reimaginada II: blazers, drop 01
  {
    id: 11,
    name: 'Lola 01',
    category: 'blazers',
    size: 'S-M',
    isNew: true,
    images: getProductImages('lola-negra'),
    status: 'disponible',
    price: 65,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 12,
    name: 'Lola 02',
    category: 'blazers',
    size: 'S-M',
    isNew: true,
    images: getProductImages('lola-gris'),
    status: 'disponible',
    price: 65,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 13,
    name: 'Jaleo 01',
    category: 'blazers',
    size: 'S-M',
    isNew: true,
    images: getProductImages('jaleo-azul'),
    status: 'disponible',
    price: 60,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 14,
    name: 'Jaleo 02',
    category: 'blazers',
    size: 'S-M',
    isNew: true,
    images: getProductImages('jaleo-gris'),
    status: 'vendida',
    price: 60,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 15,
    name: 'Lazá 01',
    category: 'blazers',
    size: 'S-M',
    isNew: true,
    images: getProductImages('laza-beige'),
    status: 'disponible',
    price: 60,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 16,
    name: 'Lazá 02',
    category: 'blazers',
    size: 'S-M',
    isNew: true,
    images: getProductImages('laza-gris'),
    status: 'disponible',
    price: 60,
    updatedAt: '2026-11-05',
    measurements: '',
  },

  // Reimaginada: tops
  {
    id: 1,
    name: 'Dolores',
    category: 'tops',
    size: 'S',
    images: getProductImages('Dolores'),
    status: 'disponible',
    price: 60,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 2,
    name: 'Carmen',
    category: 'tops',
    size: 'S',
    images: getProductImages('Carmen'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 3,
    name: 'Salina',
    category: 'tops',
    size: 'S',
    images: getProductImages('Salina'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 4,
    name: 'Hechura',
    category: 'tops',
    size: 'S',
    images: getProductImages('Hechura'),
    status: 'disponible',
    price: 45,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 5,
    name: 'Albero',
    category: 'tops',
    size: 'S',
    images: getProductImages('Albero'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 6,
    name: 'Oliva',
    category: 'tops',
    size: 'S',
    images: getProductImages('Oliva'),
    status: 'disponible',
    price: 45,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 7,
    name: 'Candela',
    category: 'tops',
    size: 'S',
    images: getProductImages('Candela'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 8,
    name: 'Solera',
    category: 'tops',
    size: 'S',
    images: getProductImages('Solera'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 9,
    name: 'Azahar',
    category: 'tops',
    size: 'S',
    images: getProductImages('Azahar'),
    status: 'disponible',
    price: 50,
    updatedAt: '2026-11-05',
    measurements: '',
  },
  {
    id: 10,
    name: 'Jara',
    category: 'tops',
    size: 'S',
    images: getProductImages('Jara'),
    status: 'disponible',
    price: 45,
    updatedAt: '2026-11-05',
    measurements: '',
  },
]

export default products

// Categorías con página propia: /coleccion/tops, /coleccion/blazers.
export const CATEGORIES = ['tops', 'blazers']

// Nombre con el tipo de prenda: "Top Dolores", "Blazer Lola 01".
export function getProductName(product, t) {
  return t(`productName.${product.category}`, { name: product.name })
}

// Nombre para buscadores: título de la página, datos estructurados y
// texto alternativo de las fotos. El cliente sigue viendo product.name.
// Se define en src/locales (products.<id>.seoName).
export function getProductSeoName(product, t) {
  const key = `products.${product.id}.seoName`
  const seoName = t(key)

  return seoName === key
    ? getProductName(product, t)
    : `${seoName} ${product.name}`
}

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
    pattern: text('pattern'),
    size: product.size,
    measurements: product.measurements,
  }
}
