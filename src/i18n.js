import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationES from './locales/es.json'
import translationEN from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: translationES
      },
      en: {
        translation: translationEN
      }
    },

    fallbackLng: 'es',

    supportedLngs: ['es', 'en'],

    interpolation: {
      escapeValue: false
    },

    // El idioma lo marca la URL (/en/... → inglés).
    // Ver src/locale.js.
    detection: {
      order: ['path'],
      lookupFromPathIndex: 0,
      caches: []
    }
  })

export default i18n