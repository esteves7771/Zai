const KEY = 'zai_allergens'
const SHOWN_KEY = 'zai_allergen_setup_shown'

export const ALLERGEN_LIST = [
  { id: 'gluten',    tag: 'en:gluten',          emoji: '🌾' },
  { id: 'lactose',   tag: 'en:milk',             emoji: '🥛' },
  { id: 'nuts',      tag: 'en:nuts',             emoji: '🥜' },
  { id: 'peanuts',   tag: 'en:peanuts',          emoji: '🥜' },
  { id: 'eggs',      tag: 'en:eggs',             emoji: '🥚' },
  { id: 'soy',       tag: 'en:soybeans',         emoji: '🫘' },
  { id: 'fish',      tag: 'en:fish',             emoji: '🐟' },
  { id: 'shellfish', tag: 'en:crustaceans',      emoji: '🦐' },
  { id: 'sesame',    tag: 'en:sesame-seeds',     emoji: '🌰' },
  { id: 'celery',    tag: 'en:celery',           emoji: '🥬' },
  { id: 'mustard',   tag: 'en:mustard',          emoji: '🌿' },
  { id: 'sulphites', tag: 'en:sulphur-dioxide',  emoji: '🍷' },
]

export function getAllergens() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function setAllergens(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids))
}

export function hasSeenAllergenSetup() {
  return localStorage.getItem(SHOWN_KEY) === 'true'
}

export function markAllergenSetupSeen() {
  localStorage.setItem(SHOWN_KEY, 'true')
}

export function checkAllergens(product) {
  const userAllergens = getAllergens()
  if (!userAllergens.length) return []
  const productAllergens = product.allergensTags || []
  return ALLERGEN_LIST.filter(a =>
    userAllergens.includes(a.id) &&
    productAllergens.some(tag => tag.includes(a.id) || tag === a.tag)
  )
}
