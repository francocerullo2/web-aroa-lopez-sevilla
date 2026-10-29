import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import FaqList from '../components/FaqList'
import { useLocalePath } from '../locale'
import '../styles/Faq.css'

function Faq() {
  const { t } = useTranslation()
  const localePath = useLocalePath()

  return (
    <main className="faq-page">

      <section className="faq-content">

        <h1>
          {t('faq.title')}
        </h1>

        <p className="faq-intro">
          {t('faq.intro')}
        </p>

        <FaqList />

        <div className="faq-more">

          <p>
            {t('faq.moreQuestions')}
          </p>

          <Link to={localePath('/contacto')}>
            {t('faq.contactButton')}
          </Link>

        </div>

      </section>

    </main>
  )
}

export default Faq
