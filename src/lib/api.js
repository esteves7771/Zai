const FOOD_BASE = 'https://world.openfoodfacts.org'
const BEAUTY_BASE = 'https://world.openbeautyfacts.org'
const HEADERS = { 'User-Agent': 'Zai/1.0 (https://esteves7771.github.io/Zai; pedro.esteves.pt@proton.me)' }

const LOCALE_MAP = {
  'pt-BR': { cc: 'br', lc: 'pt' },
  'pt-PT': { cc: 'pt', lc: 'pt' },
  'pt':    { cc: 'pt', lc: 'pt' },
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

// Strip accents and normalize query
function normalizeQuery(q) {
  return q.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// Deduplicate products by barcode
function deduplicateProducts(products) {
  const seen = new Set()
  return products.filter(p => {
    if (!p.barcode || seen.has(p.barcode)) return false
    seen.add(p.barcode)
    return true
  })
}

const FIELDS = 'code,product_name,product_name_en,product_name_fr,product_name_de,product_name_es,product_name_pt,brands,image_front_small_url,nutriscore_grade,additives_tags,nova_group,ecoscore_grade,allergens_tags,categories_tags,quantity'

async function fetchSearchResults(query, cc, lc) {
  const url = `${FOOD_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true&page_size=30&sort_by=unique_scans_n&cc=${cc}&lc=${lc}&fields=${FIELDS}`
  try {
    const res = await fetch(url, { headers: HEADERS })
    if (!res.ok) return []
    const data = await res.json()
    return (data.products || [])
      .map(p => normalizeProduct(p, 'food'))
      .filter(p => p.name && p.name !== 'Unknown Product' && p.image)
  } catch { return [] }
}

export async function searchProducts(query) {
  const { cc, lc } = getCountryParams()
  const normalized = normalizeQuery(query)
  const words = normalized.split(/\s+/).filter(w => w.length > 2)

  // Fire multiple searches in parallel
  const searches = [
    fetchSearchResults(query, cc, lc),           // original query
    fetchSearchResults(normalized, cc, lc),       // accent-stripped
    fetchSearchResults(query, 'world', lc),       // world fallback
  ]

  // If multi-word, also search individual words
  if (words.length >= 2) {
    searches.push(fetchSearchResults(words[0], cc, lc))
    if (words.length >= 2) {
      searches.push(fetchSearchResults(words.slice(0, 2).join(' '), cc, lc))
    }
  }

  const results = await Promise.all(searches)
  const merged = results.flat()
  const deduped = deduplicateProducts(merged)

  // Sort by: has image > has nutriscore > name match
  return deduped
    .sort((a, b) => {
      const aScore = (a.image ? 2 : 0) + (a.nutriscoreGrade ? 1 : 0)
      const bScore = (b.image ? 2 : 0) + (b.nutriscoreGrade ? 1 : 0)
      return bScore - aScore
    })
    .slice(0, 50)
}

export async function fetchByBarcode(barcode) {
  const { cc, lc } = getCountryParams()

  // Try food with country context
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

  // Try food world fallback
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

function getBestName(p) {
  return p.product_name_en ||
    p.product_name ||
    p.product_name_fr ||
    p.product_name_de ||
    p.product_name_es ||
    p.product_name_pt ||
    p.product_name_it ||
    Object.keys(p)
      .filter(k => k.startsWith('product_name_') && p[k])
      .map(k => p[k])[0] ||
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
