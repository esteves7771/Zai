const FOOD_BASE = 'https://world.openfoodfacts.org'
const BEAUTY_BASE = 'https://world.openbeautyfacts.org'
const HEADERS = { 'User-Agent': 'Zai/1.0 (https://esteves7771.github.io/Zai; pedro.esteves.pt@proton.me)' }

const LOCALE_MAP = {
  'pt-BR': { cc: 'br', lc: 'pt' },
  'pt-PT': { cc: 'pt', lc: 'pt' },
  'pt':    { cc: 'br', lc: 'pt' },
  'es-ES': { cc: 'es', lc: 'es' },
  'es-MX': { cc: 'mx', lc: 'es' },
  'es':    { cc: 'es', lc: 'es' },
  'fr-FR': { cc: 'fr', lc: 'fr' },
  'fr':    { cc: 'fr', lc: 'fr' },
  'de-DE': { cc: 'de', lc: 'de' },
  'de':    { cc: 'de', lc: 'de' },
  'it-IT': { cc: 'it', lc: 'it' },
  'it':    { cc: 'it', lc: 'it' },
  'en-GB': { cc: 'gb', lc: 'en' },
  'en-US': { cc: 'us', lc: 'en' },
  'en':    { cc: 'world', lc: 'en' },
}

function getCountryParams() {
  const locale = navigator.language || navigator.languages?.[0] || 'en'
  const exact = LOCALE_MAP[locale]
  if (exact) return exact
  const lang = locale.split('-')[0]
  return LOCALE_MAP[lang] || { cc: 'world', lc: 'en' }
}

export async function fetchByBarcode(barcode) {
  const { cc, lc } = getCountryParams()
  try {
    const res = await fetch(`${FOOD_BASE}/api/v2/product/${barcode}.json?cc=${cc}&lc=${lc}`, { headers: HEADERS })
    if (res.ok) {
      const data = await res.json()
      if (data.status === 1 && data.product) {
        const p = normalizeProduct(data.product, 'food')
        if (p.name && p.name !== 'Unknown Product') return p
      }
    }
  } catch {}

  // Try world if country-specific failed
  try {
    const res = await fetch(`${FOOD_BASE}/api/v2/product/${barcode}.json`, { headers: HEADERS })
    if (res.ok) {
      const data = await res.json()
      if (data.status === 1 && data.product) {
        const p = normalizeProduct(data.product, 'food')
        if (p.name && p.name !== 'Unknown Product') return p
      }
    }
  } catch {}

  // Fallback to beauty
  try {
    const res = await fetch(`${BEAUTY_BASE}/api/v2/product/${barcode}.json`, { headers: HEADERS })
    if (res.ok) {
      const data = await res.json()
      if (data.status === 1 && data.product?.product_name) {
        return normalizeProduct(data.product, 'cosmetic')
      }
    }
  } catch {}

  return null
}

export async function searchProducts(query) {
  const { cc, lc } = getCountryParams()
  const fields = 'code,product_name,product_name_en,product_name_fr,product_name_de,product_name_es,product_name_pt,brands,image_front_small_url,nutriscore_grade,additives_tags,nova_group,ecoscore_grade,allergens_tags,categories_tags'
  const url = `${FOOD_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true&page_size=50&sort_by=unique_scans_n&cc=${cc}&lc=${lc}&fields=${fields}`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error('Network error')
  const data = await res.json()
  return (data.products || [])
    .map(p => normalizeProduct(p, 'food'))
    .filter(p => p.name && p.name !== 'Unknown Product')
}

function getBestName(p) {
  return p.product_name_en ||
         p.product_name ||
         p.product_name_fr ||
         p.product_name_de ||
         p.product_name_es ||
         p.product_name_pt ||
         p.product_name_it ||
         Object.keys(p).filter(k => k.startsWith('product_name_')).map(k => p[k]).find(v => v) ||
         (p.categories_tags?.[0] || '').replace('en:', '').replace(/-/g, ' ') ||
         null
}

function normalizeProduct(p, productType = 'food') {
  return {
    barcode: p.code || p._id || '',
    name: getBestName(p) || 'Unknown Product',
    brand: p.brands || '',
    image: p.image_front_small_url || p.image_url || null,
    nutriscoreGrade: p.nutriscore_grade || p.nutrition_grades || null,
    ecoscoreGrade: p.ecoscore_grade || null,
    additivesTags: p.additives_tags || [],
    nutriments: p.nutriments || {},
    labels: p.labels_tags || [],
    allergensTags: p.allergens_tags || [],
    categories: p.categories || '',
    categoriesTags: p.categories_tags || [],
    quantity: p.quantity || '',
    ingredients: p.ingredients_text || p.ingredients_text_en || null,
    ingredientsTags: p.ingredients_tags || [],
    novaGroup: p.nova_group || null,
    ecoscore: p.ecoscore_grade || null,
    productType,
  }
}
