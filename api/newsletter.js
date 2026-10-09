// =====================================================
// CONFIGURACIÓN
// =====================================================

// Webs desde las que se acepta la suscripción.
const ALLOWED_ORIGINS = new Set(
  [
    'https://www.aroalopezsevilla.com',
    'https://aroalopezsevilla.com',
    // Despliegues de prueba de Vercel de este mismo proyecto
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
  ].filter(Boolean)
)

// Límite de suscripciones por IP: 5 cada 10 minutos.
// Es en memoria de cada instancia: frena abusos básicos
// (scripts desde una misma IP), no ataques distribuidos.
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const requestsByIp = new Map()

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MAX_EMAIL_LENGTH = 254

const GENERIC_ERROR = 'No se ha podido completar la suscripción'

// =====================================================
// UTILIDADES
// =====================================================

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']

  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }

  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  const recent = (requestsByIp.get(ip) || []).filter(
    (time) => now - time < RATE_WINDOW_MS
  )

  recent.push(now)
  requestsByIp.set(ip, recent)

  // Limpieza para que el mapa no crezca sin límite.
  if (requestsByIp.size > 5000) {
    for (const [key, times] of requestsByIp) {
      if (times.every((time) => now - time >= RATE_WINDOW_MS)) {
        requestsByIp.delete(key)
      }
    }
  }

  return recent.length > RATE_LIMIT
}

function isValidEmail(email) {
  return (
    typeof email === 'string' &&
    email.length <= MAX_EMAIL_LENGTH &&
    EMAIL_PATTERN.test(email)
  )
}

// =====================================================
// HANDLER
// =====================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')

    return res.status(405).json({
      error: 'Método no permitido',
    })
  }

  // Solo peticiones hechas desde la propia web.
  if (!ALLOWED_ORIGINS.has(req.headers.origin)) {
    return res.status(403).json({
      error: GENERIC_ERROR,
    })
  }

  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(415).json({
      error: GENERIC_ERROR,
    })
  }

  if (isRateLimited(getClientIp(req))) {
    return res.status(429).json({
      error: 'Demasiados intentos. Inténtalo de nuevo más tarde.',
    })
  }

  const body =
    req.body && typeof req.body === 'object' ? req.body : {}

  // Campo trampa: invisible para personas, los bots lo rellenan.
  // Respondemos como si todo fuera bien para no darles pistas.
  if (body.website) {
    return res.status(200).json({
      success: true,
    })
  }

  const email =
    typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : ''

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Email no válido',
    })
  }

  if (!process.env.BREVO_API_KEY) {
    console.error('Newsletter error: falta la variable BREVO_API_KEY')

    return res.status(500).json({
      error: GENERIC_ERROR,
    })
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [3],
        updateEnabled: true,
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      // El detalle se queda en los logs de Vercel, no se envía al usuario.
      const data = await response.json().catch(() => ({}))

      console.error('Brevo error:', response.status, data.code, data.message)

      return res.status(502).json({
        error: GENERIC_ERROR,
      })
    }

    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.error('Newsletter error:', error)

    return res.status(500).json({
      error: GENERIC_ERROR,
    })
  }
}
