import en from '../locales/en.js'

const LANGUAGES = { en, pt: en, es: en, fr: en, de: en, it: en }

export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pt', label: 'Portugues BR', flag: '🇧🇷' },
  { code: 'es', label: 'Espanol', flag: '🇪🇸' },
  { code: 'fr', label: 'Francais', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
]

export function getLang() {
  return localStorage.getItem('zai_lang') || 'en'
}

export function setLang(code) {
  localStorage.setItem('zai_lang', code)
}

export function t(lang) {
  return LANGUAGES[lang] || LANGUAGES.en
}
