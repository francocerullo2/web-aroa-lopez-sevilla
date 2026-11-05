import { useTranslation } from 'react-i18next'
import { getFaqParams } from '../data/faq'
import '../styles/PrivacyPolicy.css'

// Comparte el diseño de la política de privacidad.
function ShippingReturns() {
  const { t } = useTranslation()

  const sections = t('shipping.sections', {
    returnObjects: true,
    email: getFaqParams().email,
  })

  return (
    <main className="privacy-page">

      <section className="privacy-content">

        <h1>{t('shipping.title')}</h1>

        <p className="privacy-updated">
          {t('shipping.updated')}
        </p>

        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}

      </section>

    </main>
  )
}

export default ShippingReturns
