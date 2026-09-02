import { useLayoutEffect, useRef, useState } from 'react'
import '../styles/InspirationCarousel.css'

function InspirationCarousel({ images }) {
  const totalImages = images.length

  const extendedImages = [
    ...images,
    ...images,
    ...images,
  ]

  const [currentIndex, setCurrentIndex] = useState(totalImages)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [slideStep, setSlideStep] = useState(0)

  const windowRef = useRef(null)
  const slideRef = useRef(null)

  /*
   * Calculamos el ancho real de una imagen + el espacio
   * entre imágenes. Así el desplazamiento siempre es exacto.
   */
  useLayoutEffect(() => {
    const calculateStep = () => {
      if (!slideRef.current) return

      const slideWidth = slideRef.current.getBoundingClientRect().width
      const track = slideRef.current.parentElement

      if (!track) return

      const styles = window.getComputedStyle(track)
      const gap = parseFloat(styles.columnGap || styles.gap) || 0

      setSlideStep(slideWidth + gap)
    }

    calculateStep()

    const observer = new ResizeObserver(calculateStep)

    if (windowRef.current) {
      observer.observe(windowRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!images.length) {
    return null
  }

  const next = () => {
    setCurrentIndex((prev) => {
      /*
       * Si estamos en la última posición de la copia central,
       * primero nos recolocamos silenciosamente en el centro.
       */
      if (prev >= totalImages * 2) {
        setTransitionEnabled(false)

        requestAnimationFrame(() => {
          setCurrentIndex(totalImages)

          requestAnimationFrame(() => {
            setTransitionEnabled(true)
            setCurrentIndex(totalImages + 1)
          })
        })

        return totalImages
      }

      return prev + 1
    })
  }

  const previous = () => {
    setCurrentIndex((prev) => {
      /*
       * Si estamos en la primera posición de la copia izquierda,
       * volvemos silenciosamente a la copia central.
       */
      if (prev <= 0) {
        setTransitionEnabled(false)

        requestAnimationFrame(() => {
          setCurrentIndex(totalImages)

          requestAnimationFrame(() => {
            setTransitionEnabled(true)
            setCurrentIndex(totalImages - 1)
          })
        })

        return totalImages
      }

      return prev - 1
    })
  }

  const handleTransitionEnd = () => {
    /*
     * Hemos llegado al principio de la copia izquierda.
     * La posición visual es idéntica a la copia central.
     */
    if (currentIndex <= 0) {
      setTransitionEnabled(false)
      setCurrentIndex(totalImages)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true)
        })
      })
    }

    /*
     * Hemos llegado al final de la copia central.
     * La posición visual es idéntica a la copia central.
     */
    if (currentIndex >= totalImages * 2) {
      setTransitionEnabled(false)
      setCurrentIndex(totalImages)

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

      <div
        className="inspiration-window"
        ref={windowRef}
      >
        <div
          className="inspiration-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: slideStep
              ? `translate3d(-${currentIndex * slideStep}px, 0, 0)`
              : 'translate3d(0, 0, 0)',
            transition: transitionEnabled
              ? 'transform 0.5s ease'
              : 'none',
          }}
        >
          {extendedImages.map((image, index) => (
            <div
              className="inspiration-slide"
              key={`${index}-${image}`}
              ref={index === totalImages ? slideRef : null}
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