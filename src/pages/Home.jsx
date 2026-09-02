import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import heroImage from '../assets/images/home/hero.PNG'
import products from '../data/products'
import ProductCarousel from '../components/ProductCarousel'
import historyImage from '../assets/images/products/product-02.PNG'

import InspirationCarousel from '../components/InspirationCarousel'

import inspiration01 from '../assets/images/inspiration/inspiration-01.jpeg'
import inspiration02 from '../assets/images/inspiration/inspiration-02.jpg'
import inspiration03 from '../assets/images/inspiration/inspiration-03.jpeg'
import inspiration04 from '../assets/images/inspiration/inspiration-04.jpg'
import inspiration05 from '../assets/images/inspiration/inspiration-05.jpeg'
import inspiration06 from '../assets/images/inspiration/inspiration-06.jpg'
import inspiration07 from '../assets/images/inspiration/inspiration-07.jpeg'
import inspiration08 from '../assets/images/inspiration/inspiration-08.jpg'
import inspiration09 from '../assets/images/inspiration/inspiration-09.jpeg'
import inspiration10 from '../assets/images/inspiration/inspiration-10.jpg'

import '../styles/Home.css'

function Home() {
  const { t } = useTranslation()

  const inspirationImages = [
  inspiration01,
  inspiration02,
  inspiration03,
  inspiration04,
  inspiration05,
  inspiration06,
  inspiration07,
  inspiration08,
  inspiration09,
  inspiration10,
]

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('')

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()

    setNewsletterStatus('loading')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al registrar el email')
      }

      setNewsletterEmail('')
      setNewsletterStatus('success')
    } catch (error) {
      console.error(error)
      setNewsletterStatus('error')
    }
  }

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

          <div className="newsletter-form-wrapper">

            <form
              className="newsletter-form"
              onSubmit={handleNewsletterSubmit}
            >

              <input
                type="email"
                placeholder={t('home.newsletter.placeholder')}
                aria-label={t('home.newsletter.placeholder')}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
              >
                {newsletterStatus === 'loading'
                  ? '...'
                  : t('home.newsletter.button')}
              </button>

              {newsletterStatus === 'success' && (
                <p className="newsletter-message">
                  {t('home.newsletter.success')}
                </p>
              )}

              {newsletterStatus === 'error' && (
                <p className="newsletter-message">
                  {t('home.newsletter.error')}
                </p>
              )}

            </form>

            <Link
              to="/politica-privacidad"
              className="newsletter-privacy"
            >
              {t('home.newsletter.privacy')}
            </Link>

          </div>

        </div>

      </section>


      {/* GALERÍA */}
      <section className="home-gallery">
        <InspirationCarousel images={inspirationImages} />
      </section>

    </main>
  )
}

export default Home