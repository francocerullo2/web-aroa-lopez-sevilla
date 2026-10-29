import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import products, { getProductInfo } from '../data/products'
import '../styles/Product.css'
import ProductCarousel from '../components/ProductCarousel'
import NotFound from './NotFound'
import { getFaqParams } from '../data/faq'
import { useLocalePath } from '../locale'

function Product() {
  const { t } = useTranslation()
  const localePath = useLocalePath()
  const { id } = useParams()
  const params = getFaqParams()

  const product = products.find(
    (product) => product.id === Number(id)
  )

  if (!product) {
    return <NotFound />
  }

  const info = getProductInfo(product, t)

  const details = [
    { label: t('product.details.material'), value: info.material },
    { label: t('product.details.color'), value: info.color },
    { label: t('product.details.measurements'), value: info.measurements },
  ].filter((detail) => detail.value)

  const statusText = {
    disponible: t('product.status.available'),
    proximamente: t('product.status.comingSoon'),
    vendida: t('product.status.sold'),
  }

  return (
    <main className="product-page">

      {/* FOTO */}
      <section className="product-gallery">

        <ProductCarousel
          key={product.id}
          priority
          images={product.images}
          alt={t('product.imageAlt', { name: product.name })}
          alts={product.images.map((image, index) =>
            t('product.imageAltN', {
              name: product.name,
              n: index + 1,
              total: product.images.length,
            })
          )}
        />

      </section>


      {/* INFORMACIÓN */}
      <section className="product-details">

        <h1>{product.name}</h1>

        <p className={`product-status ${product.status}`}>
          {statusText[product.status]}
        </p>

        <p className="product-price">
          {product.price} €
        </p>

        <p className="product-size">
          {t('product.approximateSize')}
        </p>

        <Link
          to={localePath(`/contacto?pieza=${encodeURIComponent(product.name)}`)}
          className="product-button"
        >
          {t('product.consultPiece')}
        </Link>

        <div className="product-description">
          <p>
            {info.description}
          </p>

          {details.length > 0 && (
            <dl className="product-specs">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Información extra, plegada para no distraer de la pieza.
            El texto sigue en el HTML: Google y las IA lo leen igual. */}
        <div className="product-more">

          <details>
            <summary>
              {t('faq.items.where.question')}
            </summary>

            <p>
              {t('faq.items.where.answer')}
            </p>
          </details>

          <details>
            <summary>
              {t('faq.items.buy.question')}
            </summary>

            <p>
              {t('faq.items.buy.answer', params)}
            </p>
          </details>

          <Link
            to={localePath('/preguntas-frecuentes')}
            className="product-more-link"
          >
            {t('faq.homeButton')}
          </Link>

        </div>

        <Link
          to={localePath('/coleccion')}
          className="product-back"
        >
          {t('product.backToCollection')}
        </Link>

      </section>

    </main>
  )
}

export default Product
