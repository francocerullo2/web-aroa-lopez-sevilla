const productImages = import.meta.glob(
  '../assets/images/products/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
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

function getProductImages(name, legacyFile) {
  const newImages = getImagesByPrefix(name)

  if (newImages.length > 0) {
    return newImages
  }

  const legacyImage = Object.entries(productImages).find(
    ([path]) => {
      const fileName = path.split('/').pop().toLowerCase()

      return fileName === legacyFile.toLowerCase()
    }
  )

  return legacyImage ? [legacyImage[1]] : []
}

const products = [
  {
    id: 1,
    name: 'Dolores',
    category: 'tops',
    images: getProductImages('Dolores', 'product-01.PNG'),
    status: 'disponible',
  },
  {
    id: 2,
    name: 'Carmen',
    category: 'tops',
    images: getProductImages('Carmen', 'product-02.PNG'),
    status: 'disponible',
  },
  {
    id: 3,
    name: 'Salina',
    category: 'tops',
    images: getProductImages('Salina', 'product-03.PNG'),
    status: 'disponible',
  },
  {
    id: 4,
    name: 'Hechura',
    category: 'tops',
    images: getProductImages('Hechura', 'product-04.jpeg'),
    status: 'disponible',
  },
  {
    id: 5,
    name: 'Albero',
    category: 'tops',
    images: getProductImages('Albero', 'product-05.jpg'),
    status: 'disponible',
  },
  {
    id: 6,
    name: 'Oliva',
    category: 'tops',
    images: getProductImages('Oliva', 'product-06.jpg'),
    status: 'disponible',
  },
  {
    id: 7,
    name: 'Candela',
    category: 'tops',
    images: getProductImages('Candela', 'product-07.jpeg'),
    status: 'disponible',
  },
  {
    id: 8,
    name: 'Solera',
    category: 'tops',
    images: getProductImages('Solera', 'product-08.jpg'),
    status: 'disponible',
  },
]

export default products