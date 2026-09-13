import { useEffect, useState } from 'react'
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

function ProductCarousel({ images = [], alt }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [displayedImage, setDisplayedImage] = useState(0)

  useEffect(() => {
    if (!images.length) {
      setCurrentImage(0)
      setDisplayedImage(0)
      return
    }

    setCurrentImage(0)
    setDisplayedImage(0)

    // Precargamos todas las imágenes.
    images.forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [images])

  useEffect(() => {
    if (!images.length) {
      return
    }

    // Precargamos especialmente la siguiente y anterior.
    const nextIndex =
      currentImage + 1 >= images.length
        ? 0
        : currentImage + 1

    const previousIndex =
      currentImage - 1 < 0
        ? images.length - 1
        : currentImage - 1

    preloadImage(images[nextIndex])
    preloadImage(images[previousIndex])
  }, [currentImage, images])

  if (!images.length) {
    return null
  }

  const hasMultipleImages = images.length > 1

  const showImage = async (newIndex) => {
    if (newIndex === displayedImage) {
      return
    }

    // La imagen actual permanece visible mientras
    // esperamos a que la nueva esté completamente lista.
    const loadedImage = await preloadImage(images[newIndex])

    if (!loadedImage) {
      return
    }

    setDisplayedImage(newIndex)
    setCurrentImage(newIndex)
  }

  const nextImage = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const nextIndex =
      currentImage + 1 >= images.length
        ? 0
        : currentImage + 1

    showImage(nextIndex)
  }

  const previousImage = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const previousIndex =
      currentImage - 1 < 0
        ? images.length - 1
        : currentImage - 1

    showImage(previousIndex)
  }

  return (
    <div className="product-carousel">

      <div className="product-carousel-images">

        {images.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={index === displayedImage ? alt : ''}
            aria-hidden={index !== displayedImage}
            loading="eager"
            decoding="sync"
            className={
              index === displayedImage
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