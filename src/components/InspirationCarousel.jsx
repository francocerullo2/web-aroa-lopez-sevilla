import { useEffect, useRef } from 'react'
import { ChevronIcon } from './ProductCarousel'
import '../styles/InspirationCarousel.css'

// Galería de inspiración en bucle infinito.
//
// Las fotos se pintan dos veces seguidas: al recorrer una copia
// entera, la posición vuelve al principio sin que se note el corte.
//
// Avanza sola y se puede controlar: se detiene con el ratón encima,
// se arrastra o desliza en ambas direcciones y tiene flechas (en
// pantallas con ratón). Después de usarla se queda quieta RESUME_MS.
// Con "reducir movimiento" activado no avanza sola.
const SECONDS_PER_IMAGE = 7
const RESUME_MS = 6000

function InspirationCarousel({ images = [], alt = 'Inspiration' }) {
  const trackRef = useRef(null)

  const motionRef = useRef({
    position: 0,
    velocity: 0,
    target: null,
    hovered: false,
    dragging: false,
    lastX: 0,
    lastTime: 0,
    resumeAt: 0,
  })

  const imageCount = images.length

  useEffect(() => {
    const track = trackRef.current

    if (!track || !imageCount) {
      return undefined
    }

    const motion = motionRef.current
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    let frame
    let last = performance.now()

    const step = (now) => {
      const seconds = Math.min(now - last, 50) / 1000
      const loopWidth = track.scrollWidth / 2

      last = now

      if (loopWidth > 0) {
        if (motion.dragging) {
          // La posición la marca el dedo o el ratón.
        } else if (motion.target !== null) {
          // Movimiento de las flechas, con frenado suave.
          motion.position +=
            (motion.target - motion.position) *
            (1 - Math.exp(-seconds * 6))

          if (Math.abs(motion.target - motion.position) < 0.5) {
            motion.position = motion.target
            motion.target = null
          }
        } else if (Math.abs(motion.velocity) > 5) {
          // Inercia al soltar.
          motion.position += motion.velocity * seconds
          motion.velocity *= Math.exp(-seconds * 3.5)
        } else if (
          !reducedMotion &&
          !motion.hovered &&
          now >= motion.resumeAt
        ) {
          motion.position +=
            (loopWidth / (imageCount * SECONDS_PER_IMAGE)) * seconds
        }

        const wrapped =
          ((motion.position % loopWidth) + loopWidth) % loopWidth

        track.style.transform = `translate3d(${-wrapped}px, 0, 0)`
      }

      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(frame)
  }, [imageCount])

  if (!imageCount) {
    return null
  }

  const holdPosition = () => {
    motionRef.current.resumeAt = performance.now() + RESUME_MS
  }

  const moveBy = (direction) => {
    const motion = motionRef.current
    const slideWidth = trackRef.current.scrollWidth / 2 / imageCount
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    motion.velocity = 0

    // Se suma al destino anterior para que varios clics se acumulen.
    const from = motion.target ?? motion.position
    const destination = from + direction * slideWidth

    if (reducedMotion) {
      motion.position = destination
    } else {
      motion.target = destination
    }

    holdPosition()
  }

  const handlePointerDown = (event) => {
    if (event.button !== 0 || event.target.closest('button')) {
      return
    }

    const motion = motionRef.current

    event.currentTarget.setPointerCapture(event.pointerId)

    motion.dragging = true
    motion.target = null
    motion.velocity = 0
    motion.lastX = event.clientX
    motion.lastTime = event.timeStamp
  }

  const handlePointerMove = (event) => {
    const motion = motionRef.current

    if (!motion.dragging) {
      return
    }

    const deltaX = event.clientX - motion.lastX
    const elapsed = Math.max(event.timeStamp - motion.lastTime, 1) / 1000

    motion.position -= deltaX
    motion.velocity = -deltaX / elapsed
    motion.lastX = event.clientX
    motion.lastTime = event.timeStamp
  }

  const handlePointerEnd = (event) => {
    const motion = motionRef.current

    if (!motion.dragging) {
      return
    }

    motion.dragging = false

    // Si se detuvo antes de soltar, no hay inercia.
    if (event.timeStamp - motion.lastTime > 80) {
      motion.velocity = 0
    }

    holdPosition()
  }

  const loop = [...images, ...images]

  return (
    <div
      className="inspiration-marquee"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') {
          motionRef.current.hovered = true
        }
      }}
      onPointerLeave={() => {
        motionRef.current.hovered = false
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >

      <div
        className="inspiration-track"
        ref={trackRef}
      >
        {loop.map((image, index) => {
          const isCopy = index >= imageCount

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

      <button
        type="button"
        className="carousel-arrow carousel-arrow-left"
        onClick={() => moveBy(-1)}
        aria-label="Previous images"
      >
        <ChevronIcon direction="left" />
      </button>

      <button
        type="button"
        className="carousel-arrow carousel-arrow-right"
        onClick={() => moveBy(1)}
        aria-label="Next images"
      >
        <ChevronIcon direction="right" />
      </button>

    </div>
  )
}

export default InspirationCarousel
