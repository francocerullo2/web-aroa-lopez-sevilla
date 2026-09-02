import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import products from '../data/products'
import '../styles/Product.css'
import ProductCarousel from '../components/ProductCarousel'

function Product() {
  const { t } = useTranslation()
  const { id } = useParams()

  const product = products.find(
    (product) => product.id === Number(id)
  )

  if (!product) {
    return <h1>{t('product.notFound')}</h1>
  }

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
          images={product.images}
          alt={product.name}
        />

      </section>


      {/* INFORMACIÓN */}
      <section className="product-details">

        <h1>{product.name}</h1>

        <p className={`product-status ${product.status}`}>
          {statusText[product.status]}
        </p>

        <Link
          to={`/contacto?pieza=${encodeURIComponent(product.name)}`}
          className="product-button"
        >
          {t('product.consultPiece')}
        </Link>

        <div className="product-description">
          <p>
            {t('product.description')}
          </p>
        </div>

        <Link
          to="/coleccion"
          className="product-back"
        >
          {t('product.backToCollection')}
        </Link>

      </section>

    </main>
  )
}

export default Product