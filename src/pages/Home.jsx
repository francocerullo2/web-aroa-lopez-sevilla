import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import products from '../data/products'
import ProductCarousel from '../components/ProductCarousel'
import InspirationCarousel from '../components/InspirationCarousel'
import '../styles/Home.css'

// =====================================================
// IMÁGENES DEL HOME
// =====================================================

const homeFiles = import.meta.glob(
  '../assets/images/home/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  {
    eager: true,
    import: 'default',
  }
)

const productFiles = import.meta.glob(
  '../assets/images/products/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  {
    eager: true,
    import: 'default',
  }
)

function findImage(files, fileName) {
  const targetName = fileName.toLowerCase()

  const match = Object.entries(files).find(([path]) => {
    const currentFileName = path.split('/').pop().toLowerCase()

    const currentName = currentFileName.replace(
      /\.(jpg|jpeg|png|webp)$/,
      ''
    )

    return currentName === targetName
  })

  return match ? match[1] : null
}

// Hero:
// busca hero-01 independientemente de la extensión
// si no existe, utiliza hero
const heroImage =
  findImage(homeFiles, 'hero-01') ||
  findImage(homeFiles, 'hero')

// Prendas con historia:
// busca history-01 independientemente de la extensión
// si no existe, utiliza product-02
const historyImage =
  findImage(homeFiles, 'history-01') ||
  findImage(productFiles, 'product-02')

// =====================================================
// INSPIRACIÓN
// =====================================================

const inspirationFiles = import.meta.glob(
  '../assets/images/inspiration/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  {
    eager: true,
    import: 'default',
  }
)

const inspirationImages = Object.entries(inspirationFiles)
  .sort(([pathA], [pathB]) => {
    const fileA = pathA.split('/').pop()
    const fileB = pathB.split('/').pop()

    return fileA.localeCompare(fileB, undefined, {
      numeric: true,
    })
  })
  .map(([, image]) => image)

// =====================================================
// HOME
// =====================================================

function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

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

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`)
  }

  const handleProductKeyDown = (event, productId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigate(`/producto/${productId}`)
    }
  }

  return (
    <main className="home">

      {/* HERO */}

      <section className="hero">

        <div className="hero-image">
          <img
            src={heroImage}
            alt={t('home.hero.alt')}
            fetchPriority="high"
          />
        </div>

        <div className="hero-content">

          <p>
            {t('home.hero.label')}
          </p>

          <h1>
            {t('home.hero.title')}
          </h1>

          <Link to="/coleccion">
            {t('home.hero.button')}
          </Link>

        </div>

      </section>


      {/* NOVEDADES */}

      <section className="home-news">

        <div className="home-news-header">

          <h2>
            {t('home.news.title')}
          </h2>

          <p>
            {t('home.news.subtitle')}
          </p>

        </div>


        <div className="home-products">

          {products.slice(0, 4).map((product) => (

            <div
              key={product.id}
              className="home-product"
              onClick={() => handleProductClick(product.id)}
              onKeyDown={(event) =>
                handleProductKeyDown(event, product.id)
              }
              role="link"
              tabIndex="0"
            >

              <ProductCarousel
                images={product.images}
                alt={product.name}
              />

              <div className="home-product-info">

                <h3>
                  {product.name}
                </h3>

                <p
                  className={`home-product-status ${product.status}`}
                >
                  {statusText[product.status]}
                </p>

              </div>

            </div>

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
            loading="lazy"
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

      <section
        className="newsletter"
        id="newsletter"
      >

        <div className="newsletter-content">

          <div className="newsletter-text">

            <h2>
              {t('home.newsletter.title')}
            </h2>

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
                onChange={(e) =>
                  setNewsletterEmail(e.target.value)
                }
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

        <InspirationCarousel
          images={inspirationImages}
        />

      </section>

    </main>
  )
}

export default Home