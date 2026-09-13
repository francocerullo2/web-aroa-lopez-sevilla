import { useLayoutEffect, useRef, useState } from 'react'
import '../styles/InspirationCarousel.css'

function InspirationCarousel({ images = [] }) {
  const totalImages = images.length

  const [visibleCount, setVisibleCount] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 900 ? 2 : 4
  )

  const [currentIndex, setCurrentIndex] = useState(visibleCount)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [slideStep, setSlideStep] = useState(0)

  const windowRef = useRef(null)
  const slideRef = useRef(null)
  const isAnimatingRef = useRef(false)

  useLayoutEffect(() => {
    if (!totalImages) return

    const updateVisibleCount = () => {
      const newVisibleCount = window.innerWidth <= 900 ? 2 : 4

      setVisibleCount((previous) => {
        if (previous === newVisibleCount) {
          return previous
        }

        setTransitionEnabled(false)
        setCurrentIndex(newVisibleCount)
        isAnimatingRef.current = false

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransitionEnabled(true)
          })
        })

        return newVisibleCount
      })
    }

    updateVisibleCount()

    window.addEventListener('resize', updateVisibleCount)

    return () => {
      window.removeEventListener('resize', updateVisibleCount)
    }
  }, [totalImages])

  useLayoutEffect(() => {
    if (!totalImages) return

    const calculateStep = () => {
      if (!slideRef.current) return

      const slideWidth =
        slideRef.current.getBoundingClientRect().width

      const track = slideRef.current.parentElement

      if (!track) return

      const styles = window.getComputedStyle(track)

      const gap =
        parseFloat(styles.columnGap || styles.gap) || 0

      setSlideStep(slideWidth + gap)
    }

    calculateStep()

    const observer = new ResizeObserver(calculateStep)

    if (windowRef.current) {
      observer.observe(windowRef.current)
    }

    return () => observer.disconnect()
  }, [totalImages, visibleCount])

  if (!totalImages) {
    return null
  }

  const canSlide = totalImages > visibleCount

  const leftClones = images.slice(-visibleCount)
  const rightClones = images.slice(0, visibleCount)

  const extendedImages = [
    ...leftClones,
    ...images,
    ...rightClones,
  ]

  const next = () => {
    if (!canSlide || isAnimatingRef.current) return

    isAnimatingRef.current = true
    setTransitionEnabled(true)

    setCurrentIndex((previous) => previous + 1)
  }

  const previous = () => {
    if (!canSlide || isAnimatingRef.current) return

    isAnimatingRef.current = true
    setTransitionEnabled(true)

    setCurrentIndex((previous) => previous - 1)
  }

  const handleTransitionEnd = () => {
    if (!canSlide) {
      isAnimatingRef.current = false
      return
    }

    const firstOriginalIndex = visibleCount
    const lastOriginalIndex =
      visibleCount + totalImages - 1

    if (currentIndex > lastOriginalIndex) {
      setTransitionEnabled(false)
      setCurrentIndex(firstOriginalIndex)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true)
          isAnimatingRef.current = false
        })
      })

      return
    }

    if (currentIndex < firstOriginalIndex) {
      setTransitionEnabled(false)
      setCurrentIndex(lastOriginalIndex)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true)
          isAnimatingRef.current = false
        })
      })

      return
    }

    isAnimatingRef.current = false
  }

  return (
    <div className="inspiration-carousel">

      <button
        className="inspiration-arrow inspiration-arrow-left"
        onClick={previous}
        aria-label="Previous images"
        disabled={!canSlide}
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

            transition:
              transitionEnabled && canSlide
                ? 'transform 0.5s ease'
                : 'none',
          }}
        >
          {extendedImages.map((image, index) => (
            <div
              className="inspiration-slide"
              key={`${index}-${image}`}
              ref={
                index === visibleCount
                  ? slideRef
                  : null
              }
            >
              <img
                src={image}
                alt={`Inspiration ${
                  ((index - visibleCount + totalImages) %
                    totalImages) +
                  1
                }`}
                loading={index < visibleCount + 4 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        className="inspiration-arrow inspiration-arrow-right"
        onClick={next}
        aria-label="Next images"
        disabled={!canSlide}
      >
        →
      </button>

    </div>
  )
}

export default InspirationCarousel