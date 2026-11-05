import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import products, { CATEGORIES, getProductSeoName } from '../data/products'
import ProductCarousel from '../components/ProductCarousel'
import NotFound from './NotFound'
import { useLocalePath } from '../locale'
import '../styles/Collection.css'

// /coleccion muestra todas las piezas y /coleccion/<categoría>
// solo las de esa categoría, cada una con su URL indexable.
function Collection() {
  const { t } = useTranslation()
  const localePath = useLocalePath()
  const { category } = useParams()

  if (category && !CATEGORIES.includes(category)) {
    return <NotFound />
  }

  const statusText = {
    disponible: t('product.status.available'),
    proximamente: t('product.status.comingSoon'),
    vendida: t('product.status.sold'),
  }

  // El orden es el de products.js: lo más nuevo, primero.
  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products

  const filters = [
    { path: '/coleccion', label: t('collection.all'), active: !category },
    ...CATEGORIES.map((item) => ({
      path: `/coleccion/${item}`,
      label: t(`collection.${item}`),
      active: category === item,
    })),
  ]

  return (
    <main className="collection-page">

      <h1 className="visually-hidden">
        {category
          ? t(`collection.categories.${category}.title`)
          : t('collection.title')}
      </h1>

      <nav className="collection-filters" aria-label={t('header.collection')}>

        {filters.map((filter) => (
          <Link
            key={filter.path}
            to={localePath(filter.path)}
            className={filter.active ? 'active' : ''}
            aria-current={filter.active ? 'page' : undefined}
          >
            {filter.label}
          </Link>
        ))}

      </nav>

      <section className="collection-grid">

        {filteredProducts.map((product) => (

          <article
            className="collection-item"
            key={product.id}
          >

            <Link to={localePath(`/producto/${product.id}`)}>

              <div className="collection-image">

                <ProductCarousel
                  images={product.images}
                  alt={t('product.imageAlt', { name: getProductSeoName(product, t) })}
                />

              </div>

              <div className="collection-info">

                <h2>{product.name}</h2>

                <p className={`collection-status ${product.status}`}>
                  {statusText[product.status]}
                </p>

              </div>

            </Link>

          </article>

        ))}

      </section>

    </main>
  )
}

export default Collection
