// Recuerda si cada visitante ya se ha suscrito (en su navegador,
// para siempre) o si ha cerrado la invitación (NewsletterPopup):
// esto último solo dura la visita, así que vuelve a verla al
// entrar de nuevo si no se suscribió.

const DISMISSED_KEY = 'newsletterPopupDismissed'
const SUBSCRIBED_KEY = 'newsletterSubscribed'

// Por si el navegador bloquea el almacenamiento: así la invitación
// tampoco reaparece en esta visita después de cerrarla.
let dismissedThisVisit = false

function readStorage(storageName, key) {
  try {
    return window[storageName].getItem(key)
  } catch {
    return null
  }
}

function writeStorage(storageName, key, value) {
  try {
    window[storageName].setItem(key, value)
  } catch {
    // Navegación privada o almacenamiento bloqueado: no pasa nada.
  }
}

// Llamarla cuando cualquier formulario de newsletter tenga éxito.
export function markNewsletterSubscribed() {
  writeStorage('localStorage', SUBSCRIBED_KEY, 'true')
}

export function shouldShowNewsletterPopup() {
  return (
    !readStorage('localStorage', SUBSCRIBED_KEY) &&
    !dismissedThisVisit &&
    !readStorage('sessionStorage', DISMISSED_KEY)
  )
}

export function dismissNewsletterPopup() {
  dismissedThisVisit = true
  writeStorage('sessionStorage', DISMISSED_KEY, 'true')
}
