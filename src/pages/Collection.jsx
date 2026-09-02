import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import products from '../data/products'
import ProductCarousel from '../components/ProductCarousel'
import '../styles/Collection.css'

function Collection() {
  const { t } = useTranslation()

  const [activeFilter, setActiveFilter] = useState('all')

  const statusText = {
    disponible: t('product.status.available'),
    proximamente: t('product.status.comingSoon'),
    vendida: t('product.status.sold'),
  }

  const filteredProducts =
    activeFilter === 'all'
      ? products
      : products.filter(
          (product) => product.category === activeFilter
        )

  return (
    <main className="collection-page">

      <div className="collection-filters">

        <button
          onClick={() => setActiveFilter('all')}
          className={activeFilter === 'all' ? 'active' : ''}
        >
          {t('collection.all')}
        </button>

        <button
          onClick={() => setActiveFilter('tops')}
          className={activeFilter === 'tops' ? 'active' : ''}
        >
          {t('collection.tops')}
        </button>

        <button
          onClick={() => setActiveFilter('blazers')}
          className={activeFilter === 'blazers' ? 'active' : ''}
        >
          {t('collection.blazers')}
        </button>

        <button
          onClick={() => setActiveFilter('faldas')}
          className={activeFilter === 'faldas' ? 'active' : ''}
        >
          {t('collection.skirts')}
        </button>

      </div>

      <section className="collection-grid">

        {filteredProducts.map((product) => (

          <article
            className="collection-item"
            key={product.id}
          >

            <Link to={`/producto/${product.id}`}>

              <div className="collection-image">

                <ProductCarousel
                  images={product.images}
                  alt={product.name}
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