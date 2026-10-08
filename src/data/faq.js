import products from './products'

// Orden de las preguntas en la página de preguntas frecuentes.
// Los textos están en src/locales (faq.items.<id>).
export const FAQ_IDS = [
  'whatIs',
  'upcycling',
  'unique',
  'where',
  'price',
  'size',
  'buy',
  'types',
  'sustainable',
  'news',
]

// Selección que se muestra en el Home.
export const HOME_FAQ_IDS = ['whatIs', 'unique', 'price', 'buy']

// Datos reales del catálogo para que las respuestas
// se mantengan actualizadas solas al cambiar productos.
export function getFaqParams() {
  const prices = products.map((product) => product.price)

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    count: products.length,
    email: 'aroalopezsevilla@gmail.com',
  }
}
