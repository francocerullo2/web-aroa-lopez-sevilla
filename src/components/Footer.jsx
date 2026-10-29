import { Link } from 'react-router-dom'
import { SOCIAL } from '../data/social'
import { useTranslation } from 'react-i18next'
import { useLocalePath } from '../locale'
import '../styles/Footer.css'

function Footer() {
  const { t } = useTranslation()
  const localePath = useLocalePath()

  return (
    <footer className="footer">

      <div className="footer-brand">

        <span className="footer-symbol">*</span>

        <h2>
          Aroa López Sevilla
        </h2>

      </div>


      <div className="footer-links">

        <div className="footer-column">

          <Link to={localePath('/coleccion')}>
            {t('header.collection')}
          </Link>

          <Link to={localePath('/sobre-mi')}>
            {t('header.about')}
          </Link>

          <Link to={localePath('/preguntas-frecuentes')}>
            {t('header.faq')}
          </Link>

          <Link to={localePath('/contacto')}>
            {t('header.contact')}
          </Link>

        </div>


        <div className="footer-column">

          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>

          <a
            href={SOCIAL.tiktok}
            target="_blank"
            rel="noreferrer"
          >
            TikTok
          </a>

          <a
            href={SOCIAL.pinterest}
            target="_blank"
            rel="noreferrer"
          >
            Pinterest
          </a>

        </div>

      </div>


      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} Aroa López Sevilla
        </span>

      </div>

    </footer>
  )
}

export default Footer