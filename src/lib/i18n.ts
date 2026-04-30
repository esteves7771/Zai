import en from '../locales/en.js'
import pt from '../locales/pt.js'
import es from '../locales/es.js'
import fr from '../locales/fr.js'
import de from '../locales/de.js'
import it from '../locales/it.js'

const LANGUAGES = { en, pt, es, fr, de, it }

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
