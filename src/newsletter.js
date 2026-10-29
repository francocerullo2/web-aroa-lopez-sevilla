// Recuerda, en el navegador de cada visitante, si ya se ha
// suscrito o si ha cerrado la invitación (NewsletterPopup).

const HIDE_DAYS = 30

export const DISMISSED_KEY = 'newsletterPopupDismissedAt'
export const SUBSCRIBED_KEY = 'newsletterSubscribed'

export function readStorage(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Navegación privada o almacenamiento bloqueado: no pasa nada.
  }
}

// Llamarla cuando cualquier formulario de newsletter tenga éxito.
export function markNewsletterSubscribed() {
  writeStorage(SUBSCRIBED_KEY, 'true')
}

export function shouldShowNewsletterPopup() {
  if (readStorage(SUBSCRIBED_KEY)) {
    return false
  }

  const dismissedAt = Number(readStorage(DISMISSED_KEY))

  return !dismissedAt || Date.now() - dismissedAt > HIDE_DAYS * 86400000
}

export function dismissNewsletterPopup() {
  if (!readStorage(SUBSCRIBED_KEY)) {
    writeStorage(DISMISSED_KEY, String(Date.now()))
  }
}
