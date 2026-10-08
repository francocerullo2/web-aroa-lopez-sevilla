import { useTranslation } from 'react-i18next'
import { FAQ_IDS, getFaqParams } from '../data/faq'
import '../styles/Faq.css'

// Cada pregunta es un título y justo debajo su respuesta
// directa: el formato que mejor extraen los motores de IA.
function FaqList({ ids = FAQ_IDS, headingLevel = 'h2' }) {
  const { t } = useTranslation()
  const params = getFaqParams()
  const Heading = headingLevel

  return (
    <div className="faq-list">

      {ids.map((id) => (

        <article
          key={id}
          className="faq-item"
          id={id}
        >

          <Heading className="faq-question">
            {t(`faq.items.${id}.question`, params)}
          </Heading>

          <p className="faq-answer">
            {t(`faq.items.${id}.answer`, params)}
          </p>

        </article>

      ))}

    </div>
  )
}

export default FaqList
