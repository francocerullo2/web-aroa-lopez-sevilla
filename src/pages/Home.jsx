import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import heroImage from '../assets/images/hero.PNG'
import products from '../data/products'
import ProductCarousel from '../components/ProductCarousel'
import historyImage from '../assets/images/product-02.PNG'
import galleryImage1 from '../assets/images/product-01.PNG'
import galleryImage2 from '../assets/images/product-02.PNG'
import galleryImage3 from '../assets/images/product-01.PNG'
import galleryImage4 from '../assets/images/product-02.PNG'

import '../styles/Home.css'

function Home() {
  const { t } = useTranslation()

  const statusText = {
  disponible: t('product.status.available'),
  proximamente: t('product.status.comingSoon'),
  vendida: t('product.status.sold'),
  }

  return (
    <main className="home">

      {/* HERO */}
      <section className="hero">

        <div className="hero-image">
          <img
            src={heroImage}
            alt={t('home.hero.alt')}
          />
        </div>

        <div className="hero-content">
          <p>{t('home.hero.label')}</p>

          <h1>{t('home.hero.title')}</h1>

          <Link to="/coleccion">
            {t('home.hero.button')}
          </Link>
        </div>

      </section>


      {/* NOVEDADES */}
      <section className="home-news">

        <div className="home-news-header">
          <h2>{t('home.news.title')}</h2>

          <p>
            {t('home.news.subtitle')}
          </p>
        </div>

        <div className="home-products">

          {products.slice(0, 4).map((product) => (

            <Link
              key={product.id}
              to={`/producto/${product.id}`}
              className="home-product"
            >

              <ProductCarousel
                images={product.images}
                alt={product.name}
              />

              <div className="home-product-info">

                <h3>{product.name}</h3>

                <p className={`home-product-status ${product.status}`}>
                  {statusText[product.status]}
                </p>

              </div>

            </Link>

          ))}

        </div>

        <div className="home-news-button">
          <Link to="/coleccion">
            {t('home.news.button')}
          </Link>
        </div>

      </section>


      {/* PRENDAS CON HISTORIA */}
      <section className="history">

        <div className="history-background">
          <img
            src={historyImage}
            alt={t('home.history.alt')}
          />
        </div>

        <div className="history-content">

          <h2>
            {t('home.history.title')}
          </h2>

          <Link
            to="/sobre-mi"
            className="history-button"
          >
            {t('home.history.button')}
          </Link>

          <p>
            {t('home.history.text1')}
          </p>

          <p>
            {t('home.history.text2')}
          </p>

        </div>

      </section>


      {/* NEWSLETTER */}
      <section className="newsletter">

        <div className="newsletter-content">

          <div className="newsletter-text">

            <h2>{t('home.newsletter.title')}</h2>

            <p>
              {t('home.newsletter.text')}
            </p>

          </div>

          <form className="newsletter-form">

            <input
              type="email"
              placeholder={t('home.newsletter.placeholder')}
              aria-label={t('home.newsletter.placeholder')}
            />

            <button type="submit">
              {t('home.newsletter.button')}
            </button>

          </form>

        </div>

      </section>


      {/* GALERÍA */}
      <section className="home-gallery">

        <img
          src={galleryImage1}
          alt={t('home.gallery.alt')}
        />

        <img
          src={galleryImage2}
          alt={t('home.gallery.alt')}
        />

        <img
          src={galleryImage3}
          alt={t('home.gallery.alt')}
        />

        <img
          src={galleryImage4}
          alt={t('home.gallery.alt')}
        />

      </section>

    </main>
  )
}

export default Home