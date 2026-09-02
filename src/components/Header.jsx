import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import logo from '../assets/images/logo.png'
import instagram from '../assets/images/instagram.svg'
import pinterest from '../assets/images/pinterest.svg'
import tiktok from '../assets/images/tiktok.svg'

function Header() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isCollectionActive =
    location.pathname === '/coleccion' ||
    location.pathname.startsWith('/producto/')

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
  }

  return (
    <header className="header">

      <div className="header-top">

        {/* BOTÓN MENÚ MÓVIL */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={t('header.openMenu')}
        >
          <span></span>
          <span></span>
        </button>


        {/* REDES ESCRITORIO */}
        <div className="header-left">

          <a
            href="https://www.instagram.com/aroalopezsevilla?igsi=MWdzaGJleWZta3lscA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <img src={instagram} alt="" />
          </a>

          <a
            href="https://pin.it/E1l1a9iJR"
            target="_blank"
            rel="noreferrer"
            aria-label="Pinterest"
          >
            <img src={pinterest} alt="" />
          </a>

          <a
            href="https://www.tiktok.com/@aroalopezsevilla?_r=1&_t=ZS-99N849b0q0I"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
          >
            <img src={tiktok} alt="" />
          </a>

        </div>


        {/* LOGO */}
        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <img src={logo} alt="Aroa López Sevilla" />
        </Link>


        {/* SELECTOR IDIOMA ESCRITORIO */}
        <div className="header-right language-selector">

          <button
            onClick={() => changeLanguage('es')}
            className={i18n.language.startsWith('es') ? 'active' : ''}
          >
            ES
          </button>

          <span>/</span>

          <button
            onClick={() => changeLanguage('en')}
            className={i18n.language.startsWith('en') ? 'active' : ''}
          >
            EN
          </button>

        </div>


        {/* SELECTOR IDIOMA MÓVIL */}
        <div className="mobile-language language-selector">

          <button
            onClick={() => changeLanguage('es')}
            className={i18n.language.startsWith('es') ? 'active' : ''}
          >
            ES
          </button>

          <span>/</span>

          <button
            onClick={() => changeLanguage('en')}
            className={i18n.language.startsWith('en') ? 'active' : ''}
          >
            EN
          </button>

        </div>

      </div>


      {/* NAVEGACIÓN ESCRITORIO */}
      <nav className="nav">

        <NavLink
          to="/coleccion"
          className={
            isCollectionActive
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          {t('header.collection')}
        </NavLink>

        <NavLink
          to="/sobre-mi"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          {t('header.about')}
        </NavLink>

        <NavLink
          to="/contacto"
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          {t('header.contact')}
        </NavLink>

      </nav>


      {/* MENÚ MÓVIL */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>

        <nav className="mobile-nav">

          <NavLink
            to="/coleccion"
            onClick={closeMenu}
            className={
              isCollectionActive
                ? 'mobile-nav-link active'
                : 'mobile-nav-link'
            }
          >
            {t('header.collection')}
          </NavLink>

          <NavLink
            to="/sobre-mi"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? 'mobile-nav-link active'
                : 'mobile-nav-link'
            }
          >
            {t('header.about')}
          </NavLink>

          <NavLink
            to="/contacto"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive
                ? 'mobile-nav-link active'
                : 'mobile-nav-link'
            }
          >
            {t('header.contact')}
          </NavLink>

        </nav>


        {/* REDES MÓVIL */}
        <div className="mobile-socials">

          <a
            href="https://www.instagram.com/aroalopezsevilla?igsi=MWdzaGJleWZta3lscA%3D%3D&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <img src={instagram} alt="" />
          </a>

          <a
            href="https://pin.it/E1l1a9iJR"
            target="_blank"
            rel="noreferrer"
            aria-label="Pinterest"
          >
            <img src={pinterest} alt="" />
          </a>

          <a
            href="https://www.tiktok.com/@aroalopezsevilla?_r=1&_t=ZS-99N849b0q0I"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
          >
            <img src={tiktok} alt="" />
          </a>

        </div>

      </div>

    </header>
  )
}

export default Header