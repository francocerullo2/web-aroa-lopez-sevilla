import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocalePath } from '../locale'
import { absoluteUrl, getPinImage } from '../seo/site'
import whatsappIcon from '../assets/images/social/whatsapp.svg'
import instagramIcon from '../assets/images/social/instagram.svg'
import pinterestIcon from '../assets/images/social/pinterest.svg'
import copyIcon from '../assets/images/social/copy.svg'
import '../styles/ShareButtons.css'

const MESSAGE_MS = 3000
const INSTAGRAM_MESSAGES_INBOX = 'https://www.instagram.com/direct/inbox/'

function ShareButtons({ product }) {
  const { t } = useTranslation()
  const localePath = useLocalePath()

  const [message, setMessage] = useState('')
  const messageTimer = useRef(null)

  useEffect(() => () => clearTimeout(messageTimer.current), [])

  const url = absoluteUrl(localePath(`/producto/${product.id}`))
  const text = t('share.text', { name: product.name })

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`

  const pinterestUrl =
    'https://www.pinterest.com/pin/create/button/' +
    `?url=${encodeURIComponent(url)}` +
    `&media=${encodeURIComponent(absoluteUrl(getPinImage(product)))}` +
    `&description=${encodeURIComponent(text)}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch {
      return false
    }
  }

  const showMessage = (value) => {
    setMessage(value)
    clearTimeout(messageTimer.current)
    messageTimer.current = setTimeout(() => setMessage(''), MESSAGE_MS)
  }

  const handleCopy = async () => {
    if (await copyLink()) {
      showMessage(t('share.copied'))
    }
  }

  // Instagram no permite compartir un enlace desde una web. En móvil se
  // abre el menú del teléfono, donde aparece la app; en ordenador se copia
  // el enlace y se abren los mensajes de Instagram para pegarlo.
  const handleInstagram = async () => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

    if (isTouchDevice && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: product.name, text, url })
      } catch {
        // La persona ha cerrado el menú sin compartir.
      }

      return
    }

    if (await copyLink()) {
      showMessage(t('share.instagramCopied'))
    }

    window.open(INSTAGRAM_MESSAGES_INBOX, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="product-share">

      <div className="product-share-row">

        <span className="product-share-label">
          {t('share.label')}
        </span>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={t('share.whatsapp')}
          title={t('share.whatsapp')}
        >
          <img src={whatsappIcon} alt="" />
        </a>

        <button
          type="button"
          onClick={handleInstagram}
          aria-label={t('share.instagram')}
          title={t('share.instagram')}
        >
          <img src={instagramIcon} alt="" />
        </button>

        <a
          href={pinterestUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={t('share.pinterest')}
          title={t('share.pinterest')}
        >
          <img src={pinterestIcon} alt="" />
        </a>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={t('share.copy')}
          title={t('share.copy')}
        >
          <img src={copyIcon} alt="" />
        </button>

      </div>

      <p className="product-share-message" role="status">
        {message}
      </p>

    </div>
  )
}

export default ShareButtons
