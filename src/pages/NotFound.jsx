import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocalePath } from '../locale'
import '../styles/Faq.css'

// Página 404. Al prerenderizar se guarda como dist/404.html
// (con noindex) y Vercel la sirve con estado 404.
function NotFound() {
  const { t } = useTranslation()
  const localePath = useLocalePath()

  return (
    <main className="faq-page">

      <section className="faq-content">

        <h1>
          {t('notFound.title')}
        </h1>

        <p className="faq-intro">
          {t('notFound.text')}
        </p>

        <div className="faq-more">

          <Link to={localePath('/coleccion')}>
            {t('notFound.button')}
          </Link>

        </div>

      </section>

    </main>
  )
}

export default NotFound
