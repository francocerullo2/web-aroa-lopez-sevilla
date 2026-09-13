import { useEffect, useState } from 'react'
import '../styles/ProductCarousel.css'

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image()

    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)

    image.src = src
  })
}

function ProductCarousel({ images = [], alt }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    setCurrentImage(0)
    setIsChanging(false)

    if (!images.length) {
      return
    }

    // Precarga todas las imágenes del producto.
    images.forEach((image) => {
      const preloadedImage = new Image()
      preloadedImage.src = image
    })
  }, [images])

  if (!images.length) {
    return null
  }

  const hasMultipleImages = images.length > 1

  const changeImage = async (newIndex) => {
    if (isChanging || newIndex === currentImage) {
      return
    }

    setIsChanging(true)

    // Esperamos a que la imagen esté completamente cargada.
    await preloadImage(images[newIndex])

    setCurrentImage(newIndex)

    setIsChanging(false)
  }

  const nextImage = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const nextIndex =
      currentImage + 1 >= images.length
        ? 0
        : currentImage + 1

    changeImage(nextIndex)
  }

  const previousImage = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const previousIndex =
      currentImage - 1 < 0
        ? images.length - 1
        : currentImage - 1

    changeImage(previousIndex)
  }

  return (
    <div className="product-carousel">

      <div className="product-carousel-images">

        <img
          src={images[currentImage]}
          alt={alt}
          className="product-carousel-image active"
          loading="eager"
          decoding="async"
        />

      </div>

      {hasMultipleImages && (
        <>
          <button
            type="button"
            className="carousel-arrow carousel-arrow-left"
            onClick={previousImage}
            disabled={isChanging}
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            type="button"
            className="carousel-arrow carousel-arrow-right"
            onClick={nextImage}
            disabled={isChanging}
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