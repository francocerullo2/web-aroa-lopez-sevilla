import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/Footer.css'

function Footer() {
  const { t } = useTranslation()

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

          <Link to="/coleccion">
            {t('header.collection')}
          </Link>

          <Link to="/sobre-mi">
            {t('header.about')}
          </Link>

          <Link to="/contacto">
            {t('header.contact')}
          </Link>

        </div>


        <div className="footer-column">

          <a
            href="https://www.instagram.com/aroalopezsevilla?igsi=MWdzaGJleWZta3lscA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>

          <a
            href="https://www.tiktok.com/@aroalopezsevilla?_r=1&_t=ZS-99N849b0q0I"
            target="_blank"
            rel="noreferrer"
          >
            TikTok
          </a>

          <a
            href="https://pin.it/E1l1a9iJR"
            target="_blank"
            rel="noreferrer"
          >
            Pinterest
          </a>

        </div>

      </div>


      <div className="footer-bottom">

        <span>
          © 2026 Aroa López Sevilla
        </span>

      </div>

    </footer>
  )
}

export default Footer