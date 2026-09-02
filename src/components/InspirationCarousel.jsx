import { useState } from 'react'
import '../styles/InspirationCarousel.css'

function InspirationCarousel({ images }) {
  const visibleImages = 4
  const totalImages = images.length

  // Repetimos las imágenes para crear el efecto infinito
  const extendedImages = [
    ...images,
    ...images,
    ...images,
  ]

  // Empezamos en la copia central
  const [currentIndex, setCurrentIndex] = useState(totalImages)
  const [transitionEnabled, setTransitionEnabled] = useState(true)

  const next = () => {
    setCurrentIndex((prev) => prev + 1)
  }

  const previous = () => {
    setCurrentIndex((prev) => prev - 1)
  }

  const handleTransitionEnd = () => {
    // Si hemos llegado demasiado lejos hacia delante,
    // volvemos silenciosamente a la copia central.
    if (currentIndex >= totalImages * 2) {
      setTransitionEnabled(false)
      setCurrentIndex(currentIndex - totalImages)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true)
        })
      })
    }

    // Lo mismo hacia atrás.
    if (currentIndex < totalImages) {
      setTransitionEnabled(false)
      setCurrentIndex(currentIndex + totalImages)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true)
        })
      })
    }
  }

  return (
    <div className="inspiration-carousel">

      <button
        className="inspiration-arrow inspiration-arrow-left"
        onClick={previous}
        aria-label="Previous images"
      >
        ←
      </button>

      <div className="inspiration-window">
        <div
          className="inspiration-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(calc(-${currentIndex} * (25% + 1.25px)))`,
            transition: transitionEnabled
              ? 'transform 0.5s ease'
              : 'none',
          }}
        >
          {extendedImages.map((image, index) => (
            <div
              className="inspiration-slide"
              key={`${index}-${image}`}
            >
              <img
                src={image}
                alt={`Inspiration ${(index % totalImages) + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        className="inspiration-arrow inspiration-arrow-right"
        onClick={next}
        aria-label="Next images"
      >
        →
      </button>

    </div>
  )
}

export default InspirationCarousel