export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido',
    })
  }

  const { email } = req.body

  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      error: 'Email no válido',
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
        email: email.trim(),
        listIds: [3],
        updateEnabled: true,
      }),
    })

    if (!response.ok) {
      const data = await response.json()

      return res.status(response.status).json({
        error: data.message || 'Error al registrar el email',
      })
    }

    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    console.error('Newsletter error:', error)

    return res.status(500).json({
      error: 'Error interno del servidor',
    })
  }
}