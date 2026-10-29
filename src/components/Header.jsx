import { useEffect, useRef, useState } from 'react'
import { SOCIAL } from '../data/social'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../assets/images/brand/logo.png'
import instagram from '../assets/images/social/instagram.svg'
import pinterest from '../assets/images/social/pinterest.svg'
import tiktok from '../assets/images/social/tiktok.svg'
import { getPathLanguage, localizePath, stripLanguage, useLocalePath } from '../locale'

function Header() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const localePath = useLocalePath()
  const [menuOpen, setMenuOpen] = useState(false)

  // Menú fijo: al pasar el header grande, aparece una versión
  // compacta fijada arriba. El hueco del header se mantiene con
  // la misma altura (compactHeight), así el contenido no salta.
  const shellRef = useRef(null)
  const [compactHeight, setCompactHeight] = useState(null)

  useEffect(() => {
    const onScroll = () => {
      setCompactHeight((current) => {
        const fullHeight = current ?? shellRef.current?.offsetHeight ?? 0

        return window.scrollY > fullHeight ? fullHeight : null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isCompact = compactHeight !== null

  const currentLanguage = getPathLanguage(location.pathname)
  const basePath = stripLanguage(location.pathname)

  const isCollectionActive =
    basePath === '/coleccion' ||
    basePath.startsWith('/producto/')

  const closeMenu = () => {
    setMenuOpen(false)
  }

  // Cada idioma tiene su URL: /coleccion ↔ /en/coleccion
  const changeLanguage = (language) => {
    if (language === currentLanguage) {
      return
    }

    i18n.changeLanguage(language)

    navigate(
      `${localizePath(basePath, language)}${location.search}${location.hash}`
    )
  }

  return (
    <div
      ref={shellRef}
      className="header-shell"
      style={isCompact ? { height: compactHeight } : undefined}
    >
      <header className={isCompact ? 'header is-compact' : 'header'}>

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
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <img src={instagram} alt="" />
            </a>

            <a
              href={SOCIAL.pinterest}
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
            >
              <img src={pinterest} alt="" />
            </a>

            <a
              href={SOCIAL.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <img src={tiktok} alt="" />
            </a>

          </div>


          {/* LOGO */}
          <Link
            to={localePath('/')}
            className="logo"
            onClick={closeMenu}
          >
            <img src={logo} alt="Aroa López Sevilla" />
          </Link>


          {/* SELECTOR IDIOMA ESCRITORIO */}
          <div className="header-right language-selector">

            <button
              onClick={() => changeLanguage('es')}
              className={currentLanguage === 'es' ? 'active' : ''}
            >
              ES
            </button>

            <span>/</span>

            <button
              onClick={() => changeLanguage('en')}
              className={currentLanguage === 'en' ? 'active' : ''}
            >
              EN
            </button>

          </div>


          {/* SELECTOR IDIOMA MÓVIL */}
          <div className="mobile-language language-selector">

            <button
              onClick={() => changeLanguage('es')}
              className={currentLanguage === 'es' ? 'active' : ''}
            >
              ES
            </button>

            <span>/</span>

            <button
              onClick={() => changeLanguage('en')}
              className={currentLanguage === 'en' ? 'active' : ''}
            >
              EN
            </button>

          </div>

        </div>


        {/* NAVEGACIÓN ESCRITORIO */}
        <nav className="nav">

          <NavLink
            to={localePath('/coleccion')}
            className={
              isCollectionActive
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            {t('header.collection')}
          </NavLink>

          <NavLink
            to={localePath('/sobre-mi')}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {t('header.about')}
          </NavLink>

          <NavLink
            to={localePath('/contacto')}
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
              to={localePath('/coleccion')}
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
              to={localePath('/sobre-mi')}
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
              to={localePath('/contacto')}
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
              href={SOCIAL.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <img src={instagram} alt="" />
            </a>

            <a
              href={SOCIAL.pinterest}
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
            >
              <img src={pinterest} alt="" />
            </a>

            <a
              href={SOCIAL.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <img src={tiktok} alt="" />
            </a>

          </div>

        </div>

      </header>
    </div>
  )
}

export default Header