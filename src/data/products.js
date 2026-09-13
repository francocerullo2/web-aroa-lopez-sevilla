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

function getProductImages(name, legacyFile) {
  const newImages = getImagesByPrefix(name)

  if (newImages.length > 0) {
    return newImages
  }

  if (!legacyFile) {
    return []
  }

  const legacyImage = Object.entries(productImages).find(([path]) => {
    const fileName = path.split('/').pop().toLowerCase()

    return fileName === legacyFile.toLowerCase()
  })

  return legacyImage ? [legacyImage[1]] : []
}

const products = [
  {
    id: 1,
    name: 'Dolores',
    category: 'tops',
    images: getProductImages('Dolores', 'product-01.PNG'),
    status: 'disponible',
    price: 60,
  },
  {
    id: 2,
    name: 'Carmen',
    category: 'tops',
    images: getProductImages('Carmen', 'product-02.PNG'),
    status: 'disponible',
    price: 50,
  },
  {
    id: 3,
    name: 'Salina',
    category: 'tops',
    images: getProductImages('Salina', 'product-03.PNG'),
    status: 'disponible',
    price: 50,
  },
  {
    id: 4,
    name: 'Hechura',
    category: 'tops',
    images: getProductImages('Hechura', 'product-04.jpeg'),
    status: 'disponible',
    price: 45,
  },
  {
    id: 5,
    name: 'Albero',
    category: 'tops',
    images: getProductImages('Albero', 'product-05.jpg'),
    status: 'disponible',
    price: 50,
  },
  {
    id: 6,
    name: 'Oliva',
    category: 'tops',
    images: getProductImages('Oliva', 'product-06.jpg'),
    status: 'disponible',
    price: 45,
  },
  {
    id: 7,
    name: 'Candela',
    category: 'tops',
    images: getProductImages('Candela', 'product-07.jpeg'),
    status: 'disponible',
    price: 50,
  },
  {
    id: 8,
    name: 'Solera',
    category: 'tops',
    images: getProductImages('Solera', 'product-08.jpg'),
    status: 'disponible',
    price: 50,
  },
  {
    id: 9,
    name: 'Azahar',
    category: 'tops',
    images: getProductImages('Azahar'),
    status: 'disponible',
    price: 50,
  },
  {
    id: 10,
    name: 'Jara',
    category: 'tops',
    images: getProductImages('Jara'),
    status: 'disponible',
    price: 45,
  },
]

export default products