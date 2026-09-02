import { useState } from 'react'
import '../styles/ProductCarousel.css'

function ProductCarousel({ images, alt }) {
  const [currentImage, setCurrentImage] = useState(0)

  const hasMultipleImages = images.length > 1

  const nextImage = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setCurrentImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    )
  }

  const previousImage = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setCurrentImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    )
  }

  return (
    <div className="product-carousel">

      <img
        src={images[currentImage]}
        alt={alt}
      />

      {hasMultipleImages && (
        <>
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={previousImage}
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={nextImage}
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}

    </div>
  )
}

export default ProductCarousel