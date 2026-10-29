import '../styles/InspirationCarousel.css'

// Galería de inspiración en bucle infinito.
//
// Las fotos se pintan dos veces seguidas y la cinta se desplaza
// hasta la mitad: en ese punto la segunda copia está exactamente
// donde empezó la primera, así que el bucle no tiene cortes.
// Se detiene al pasar el ratón. Con "reducir movimiento" activado
// se convierte en una fila que se desliza a mano.
const SECONDS_PER_IMAGE = 7

function InspirationCarousel({ images = [], alt = 'Inspiration' }) {
  if (!images.length) {
    return null
  }

  const loop = [...images, ...images]

  return (
    <div className="inspiration-marquee">

      <div
        className="inspiration-track"
        style={{
          '--marquee-duration': `${images.length * SECONDS_PER_IMAGE}s`,
        }}
      >
        {loop.map((image, index) => {
          const isCopy = index >= images.length

          return (
            <div
              className="inspiration-slide"
              key={`${index}-${image}`}
              aria-hidden={isCopy || undefined}
            >
              <img
                src={image}
                alt={isCopy ? '' : `${alt} ${index + 1}`}
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default InspirationCarousel
