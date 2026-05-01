const KEY = 'zai_allergens'
const SHOWN_KEY = 'zai_allergen_setup_shown'

export const ALLERGEN_LIST = [
  { id: 'gluten',     tag: 'en:gluten',     emoji: '🌾', label: 'Gluten' },
  { id: 'lactose',    tag: 'en:milk',       emoji: '🥛', label: 'Lactose / Milk' },
  { id: 'nuts',       tag: 'en:nuts',       emoji: '🥜', label: 'Tree Nuts' },
  { id: 'peanuts',    tag: 'en:peanuts',    emoji: '🥜', label: 'Peanuts' },
  { id: 'eggs',       tag: 'en:eggs',       emoji: '🥚', label: 'Eggs' },
  { id: 'soy',        tag: 'en:soybeans',   emoji: '🫘', label: 'Soy' },
  { id: 'fish',       tag: 'en:fish',       emoji: '🐟', label: 'Fish' },
  { id: 'shellfish',  tag: 'en:crustaceans',emoji: '🦐', label: 'Shellfish' },
  { id: 'sesame',     tag: 'en:sesame-seeds',emoji: '🌰', label: 'Sesame' },
  { id: 'celery',     tag: 'en:celery',     emoji: '🥬', label: 'Celery' },
  { id: 'mustard',    tag: 'en:mustard',    emoji: '🌿', label: 'Mustard' },
  { id: 'sulphites',  tag: 'en:sulphur-dioxide', emoji: '🍷', label: 'Sulphites' },
]

export function getAllergens() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch { return [] }
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
