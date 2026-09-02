import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/About.css'

import aboutImage from '../assets/images/product-01.PNG'
import projectImage from '../assets/images/product-01.PNG'

function About() {
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

  return (
    <main className="about-page">

      {/* QUIÉN ESTÁ DETRÁS */}

      <section className="about-intro">

        <div className="about-intro-text">

          <h1>{t('about.title')}</h1>

          <div className="about-description">

            <p>
              {t('about.intro1')}
            </p>

            <p>
              {t('about.intro2')}
            </p>

            <p>
              {t('about.intro3')}
            </p>

            <p>
              {t('about.intro4')}
            </p>

          </div>

        </div>

        <div className="about-intro-image">

          <img
            src={aboutImage}
            alt="Aroa López Sevilla"
          />

        </div>

      </section>


      {/* EL PROYECTO */}

      <section className="about-project">

        <div className="about-project-image">

          <img
            src={projectImage}
            alt={t('about.projectImageAlt')}
          />

        </div>

        <div className="about-project-content">

          <h2>{t('about.projectTitle')}</h2>

          <div className="about-project-text">

            <p>
              {t('about.project1')}
            </p>

            <p>
              {t('about.project2')}
            </p>

            <p>
              {t('about.project3')}
            </p>

            <p>
              {t('about.project4')}
            </p>

          </div>

        </div>

      </section>


      {/* MANIFIESTO */}

      <section className="about-manifesto">

        <p>
          {t('about.manifesto')}
        </p>

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

            <a
              href="/politica-privacidad"
              className="newsletter-privacy"
            >
              {t('home.newsletter.privacy')}
            </a>

          </div>

        </div>

      </section>

    </main>
  )
}

export default About