import { useEffect, useState } from 'react'
import '../styles/ProductCarousel.css'

function ProductCarousel({ images = [], alt }) {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    images.forEach((image) => {
      const preloadedImage = new Image()
      preloadedImage.src = image
    })
  }, [images])

  if (!images.length) {
    return null
  }

  const hasMultipleImages = images.length > 1

  const nextImage = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setCurrentImage((current) =>
      current + 1 >= images.length ? 0 : current + 1
    )
  }

  const previousImage = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setCurrentImage((current) =>
      current - 1 < 0 ? images.length - 1 : current - 1
    )
  }

  return (
    <div className="product-carousel">

      <div className="product-carousel-images">
        {images.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={index === currentImage ? alt : ''}
            aria-hidden={index !== currentImage}
            loading="eager"
            decoding="async"
            className={
              index === currentImage
                ? 'product-carousel-image active'
                : 'product-carousel-image'
            }
          />
        ))}
      </div>

      {hasMultipleImages && (
        <>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-left"
            onClick={previousImage}
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            type="button"
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