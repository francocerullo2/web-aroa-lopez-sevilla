import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/ProductCarousel.css'

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image()

    image.onload = () => {
      resolve(image)
    }

    image.onerror = () => {
      resolve(null)
    }

    image.src = src
  })
}

export function ChevronIcon({ direction }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={direction === 'left' ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Pantallas táctiles o estrechas: se usa la fila deslizable.
const SWIPE_QUERY = '(hover: none), (max-width: 600px)'

function useSwipeLayout() {
  const [matches, setMatches] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(SWIPE_QUERY).matches
  )

  useEffect(() => {
    const query = window.matchMedia(SWIPE_QUERY)
    const onChange = (event) => setMatches(event.matches)

    query.addEventListener('change', onChange)

    return () => query.removeEventListener('change', onChange)
  }, [])

  return matches
}

// Carrusel de fotos de una pieza.
//
// - `alts` (opcional): un texto alternativo distinto por foto.
// - `priority`: para la ficha de producto. Pinta todas las fotos
//   (Google Imágenes las ve) y carga la primera con prioridad.
//   Sin él (listados), solo se descarga la primera foto, en
//   diferido, y las demás cuando la persona interactúa.
//
// - `sold`: pinta la franja de pieza vendida sobre las fotos.
//
// Si cambian las fotos (otra pieza), el padre debe cambiar
// la `key` para empezar de nuevo desde la primera.
function ProductCarousel({ images = [], alt, alts, priority = false, sold = false }) {
  const { t } = useTranslation()
  const [displayedImage, setDisplayedImage] = useState(0)
  const [requested, setRequested] = useState(() => new Set([0]))
  const [interacted, setInteracted] = useState(false)
  const isSwipeLayout = useSwipeLayout()
  const [swipeImage, setSwipeImage] = useState(0)

  // Foto que está saliendo y hacia dónde (para la animación).
  const [leaving, setLeaving] = useState(null)

  // Al interactuar, precargamos la siguiente y la anterior
  // para que el cambio sea instantáneo.
  useEffect(() => {
    if (!interacted || images.length < 2) {
      return
    }

    const nextIndex = (displayedImage + 1) % images.length
    const previousIndex =
      (displayedImage - 1 + images.length) % images.length

    preloadImage(images[nextIndex])
    preloadImage(images[previousIndex])
  }, [interacted, displayedImage, images])

  if (!images.length) {
    return null
  }

  const hasMultipleImages = images.length > 1

  // Va fuera de la fila de fotos para quedarse fija al cambiar de foto.
  // aria-hidden: el estado ya se anuncia en el texto de la pieza.
  const soldFilm = sold && (
    <div className="sold-film" aria-hidden="true">
      <span>{t('product.status.sold')}</span>
    </div>
  )

  // Móvil: fila de fotos que se desliza con el dedo, con unas
  // barritas debajo que indican en qué foto estás.
  if (isSwipeLayout) {
    const handleSwipeScroll = (event) => {
      const row = event.currentTarget

      setSwipeImage(Math.round(row.scrollLeft / row.clientWidth))
    }

    return (
      <div className="product-carousel-swipe">

        <div className="product-carousel is-swipe">

          <div
            className="product-carousel-images"
            onScroll={handleSwipeScroll}
          >
            {images.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={alts?.[index] ?? alt}
                loading={priority && index === 0 ? 'eager' : 'lazy'}
                fetchPriority={priority && index === 0 ? 'high' : undefined}
                decoding="async"
                draggable="false"
                className="product-carousel-image"
              />
            ))}
          </div>

          {soldFilm}

        </div>

        {hasMultipleImages && (
          <div className="carousel-bars" aria-hidden="true">
            {images.map((image, index) => (
              <span
                key={`${image}-${index}`}
                className={
                  index === swipeImage
                    ? 'carousel-bar active'
                    : 'carousel-bar'
                }
              />
            ))}
          </div>
        )}

      </div>
    )
  }

  const showImage = async (newIndex, direction) => {
    if (newIndex === displayedImage) {
      return
    }

    // La imagen actual permanece visible mientras
    // esperamos a que la nueva esté completamente lista.
    const loadedImage = await preloadImage(images[newIndex])

    if (!loadedImage) {
      return
    }

    setRequested((previous) => new Set(previous).add(newIndex))
    setLeaving({ index: displayedImage, direction })
    setDisplayedImage(newIndex)
  }

  const nextImage = (event) => {
    event.preventDefault()
    event.stopPropagation()

    showImage((displayedImage + 1) % images.length, 'next')
  }

  const previousImage = (event) => {
    event.preventDefault()
    event.stopPropagation()

    showImage((displayedImage - 1 + images.length) % images.length, 'prev')
  }

  const startInteraction = () => {
    if (!interacted) {
      setInteracted(true)
    }
  }

  return (
    <div
      className="product-carousel"
      onPointerEnter={startInteraction}
      onTouchStart={startInteraction}
      onFocus={startInteraction}
    >

      <div className="product-carousel-images">

        {images.map((image, index) => {
          if (
            !priority &&
            !requested.has(index) &&
            index !== displayedImage
          ) {
            return null
          }

          const isDisplayed = index === displayedImage
          const isLeaving = !isDisplayed && leaving?.index === index

          // La nueva entra deslizándose desde el lado de la flecha
          // y la anterior se retira más despacio por debajo.
          let className = 'product-carousel-image'

          if (isDisplayed) {
            className += ' active'

            if (leaving) {
              className += ` enter-${leaving.direction}`
            }
          } else if (isLeaving) {
            className += ` leaving leave-${leaving.direction}`
          }

          return (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={isDisplayed ? (alts?.[index] ?? alt) : ''}
              aria-hidden={!isDisplayed}
              loading={priority || index > 0 ? 'eager' : 'lazy'}
              fetchPriority={priority && index === 0 ? 'high' : undefined}
              decoding={isDisplayed ? 'sync' : 'async'}
              className={className}
              onAnimationEnd={
                isLeaving ? () => setLeaving(null) : undefined
              }
            />
          )
        })}

      </div>

      {soldFilm}

      {hasMultipleImages && (
        <>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-left"
            onClick={previousImage}
            aria-label="Previous image"
          >
            <ChevronIcon direction="left" />
          </button>

          <button
            type="button"
            className="carousel-arrow carousel-arrow-right"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronIcon direction="right" />
          </button>
        </>
      )}

    </div>
  )
}

export default ProductCarousel
