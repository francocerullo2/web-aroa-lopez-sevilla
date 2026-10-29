// Aparición suave de secciones al hacer scroll.
//
// Solo se aplica a lo que está por debajo de la pantalla al
// cargar (lo visible no parpadea) y solo en el navegador: el HTML
// prerenderizado que leen Google y las IA no cambia.

const ITEMS = '.home-product, .collection-item, .faq-item'

const SELECTOR = `main > section, ${ITEMS}`

export function revealOnScroll() {
  if (
    typeof IntersectionObserver === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return () => {}
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px' }
  )

  const elements = [...document.querySelectorAll(SELECTOR)]

  elements.forEach((element) => {
    // Las secciones con piezas o preguntas no se animan enteras:
    // aparecen sus elementos uno a uno.
    if (element.matches('main > section') && element.querySelector(ITEMS)) {
      return
    }

    if (element.getBoundingClientRect().top < window.innerHeight) {
      return
    }

    // Las piezas de una misma fila aparecen una detrás de otra.
    const siblings = [...element.parentElement.children]
    const index = siblings.indexOf(element) % 4

    element.style.transitionDelay = `${index * 90}ms`
    element.classList.add('reveal')
    observer.observe(element)
  })

  return () => observer.disconnect()
}
