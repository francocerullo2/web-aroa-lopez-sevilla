import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'

// =====================================================
// IDIOMA POR URL
// =====================================================
// Español en la raíz (/coleccion) e inglés con prefijo
// (/en/coleccion). La URL manda: así cada idioma tiene su
// propia página indexable con hreflang.

export const LANGUAGES = ['es', 'en']
export const DEFAULT_LANGUAGE = 'es'

export function getPathLanguage(pathname) {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : DEFAULT_LANGUAGE
}

// "/en/coleccion" → "/coleccion", "/en" → "/"
export function stripLanguage(pathname) {
  return pathname.replace(/^\/en(?=\/|$)/, '') || '/'
}

// "/coleccion" + "en" → "/en/coleccion"
export function localizePath(path, language) {
  const clean = stripLanguage(path)

  if (language === DEFAULT_LANGUAGE) {
    return clean
  }

  return clean === '/' ? `/${language}` : `/${language}${clean}`
}

// Devuelve una función que localiza rutas internas
// según el idioma de la URL actual.
export function useLocalePath() {
  const { pathname } = useLocation()
  const language = getPathLanguage(pathname)

  return useCallback((path) => {
    const [base, hash] = path.split('#')
    const [route, query] = base.split('?')
    const localized = localizePath(route || '/', language)

    return `${localized}${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`
  }, [language])
}
