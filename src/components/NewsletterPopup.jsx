import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { stripLanguage, useLocalePath } from '../locale'
import { getAllRoutes } from '../seo/site'
import {
  dismissNewsletterPopup,
  markNewsletterSubscribed,
  shouldShowNewsletterPopup,
} from '../newsletter'
import popupImage from '../assets/images/home/hero-01.webp'
import '../styles/NewsletterPopup.css'

// Invitación a la newsletter al entrar en la web.
//
// - Aparece a los DELAY_MS o al bajar SCROLL_RATIO de la página.
// - Si se cierra, no vuelve a salir en 30 días (HIDE_DAYS en src/newsletter.js).
// - Si la persona se suscribe (aquí o en cualquier formulario
//   de newsletter), no vuelve a salir nunca.
// - Solo existe en el navegador: no forma parte del HTML
//   prerenderizado, así que no afecta al SEO.

const DELAY_MS = 8000
const SCROLL_RATIO = 0.4
const EXCLUDED_PATHS = ['/contacto', '/politica-privacidad']

function NewsletterPopup() {
  const { t } = useTranslation()
  const localePath = useLocalePath()
  const { pathname } = useLocation()

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')

  const inputRef = useRef(null)

  const basePath = stripLanguage(pathname)

  // Tampoco en la página 404.
  const excluded =
    EXCLUDED_PATHS.includes(basePath) ||
    !getAllRoutes().includes(basePath)

  const visible = open && !excluded

  const close = useCallback(() => {
    setOpen(false)
    dismissNewsletterPopup()
  }, [])

  // Programar la aparición.
  useEffect(() => {
    if (open || excluded || !shouldShowNewsletterPopup()) {
      return
    }

    const show = () => setOpen(true)

    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight

      if (scrollable > 0 && window.scrollY / scrollable >= SCROLL_RATIO) {
        show()
      }
    }

    const timer = setTimeout(show, DELAY_MS)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open, excluded])

  // Escape para cerrar y foco en el email al abrir.
  useEffect(() => {
    if (!visible) {
      return
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    const focusTimer = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
    }, 350)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(focusTimer)
    }
  }, [visible, close])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setStatus('loading')

    // Campo trampa anti-bots (oculto para las personas)
    const website = event.currentTarget.elements.website?.value || ''

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          website,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al registrar el email')
      }

      setEmail('')
      setStatus('success')
      markNewsletterSubscribed()
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  if (!visible) {
    return null
  }

  return (
    <div
      className="newsletter-popup-overlay"
      onClick={close}
    >

      <div
        className="newsletter-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-popup-title"
        onClick={(event) => event.stopPropagation()}
      >

        <button
          type="button"
          className="newsletter-popup-close"
          onClick={close}
          aria-label={t('newsletterPopup.close')}
        >
          ×
        </button>


        <div className="newsletter-popup-image">
          <img
            src={popupImage}
            alt=""
          />
        </div>


        <div className="newsletter-popup-content">

          <p className="newsletter-popup-label">
            {t('newsletterPopup.label')}
          </p>

          <h2 id="newsletter-popup-title">
            {t('newsletterPopup.title')}
          </h2>

          {status === 'success' ? (

            <p className="newsletter-popup-text">
              {t('newsletterPopup.success')}
            </p>

          ) : (
            <>

              <p className="newsletter-popup-text">
                {t('newsletterPopup.text')}
              </p>

              <form
                className="newsletter-popup-form"
                onSubmit={handleSubmit}
              >

                <input
                  ref={inputRef}
                  type="email"
                  placeholder={t('home.newsletter.placeholder')}
                  aria-label={t('home.newsletter.placeholder')}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />

                <input
                  type="text"
                  name="website"
                  className="visually-hidden"
                  tabIndex="-1"
                  autoComplete="off"
                  aria-hidden="true"
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                >
                  {status === 'loading'
                    ? '...'
                    : t('home.newsletter.button')}
                </button>

              </form>

              {status === 'error' && (
                <p className="newsletter-popup-error">
                  {t('home.newsletter.error')}
                </p>
              )}

              <Link
                to={localePath('/politica-privacidad')}
                className="newsletter-popup-privacy"
                onClick={close}
              >
                {t('home.newsletter.privacy')}
              </Link>

            </>
          )}

          <button
            type="button"
            className="newsletter-popup-dismiss"
            onClick={close}
          >
            {status === 'success'
              ? t('newsletterPopup.continue')
              : t('newsletterPopup.dismiss')}
          </button>

        </div>

      </div>

    </div>
  )
}

export default NewsletterPopup
