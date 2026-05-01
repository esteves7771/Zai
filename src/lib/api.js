const FOOD_BASE = 'https://world.openfoodfacts.org'
const BEAUTY_BASE = 'https://world.openbeautyfacts.org'
const HEADERS = { 'User-Agent': 'Zai/1.0 (https://esteves7771.github.io/Zai; pedro.esteves.pt@proton.me)' }

export async function fetchByBarcode(barcode) {
  // Try food first
  try {
    const res = await fetch(`${FOOD_BASE}/api/v2/product/${barcode}.json`, { headers: HEADERS })
    if (res.ok) {
      const data = await res.json()
      if (data.status === 1 && data.product?.product_name) {
        return normalizeProduct(data.product, 'food')
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
  const url = `${FOOD_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true&page_size=20&fields=code,product_name,brands,image_front_small_url,nutriscore_grade,additives_tags,nutrition_grades,nova_group`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error('Network error')
  const data = await res.json()
  return (data.products || [])
    .filter(p => p.product_name)
    .map(p => normalizeProduct(p, 'food'))
}

function normalizeProduct(p, productType = 'food') {
  return {
    barcode: p.code || p._id || '',
    name: p.product_name || p.product_name_en || 'Unknown Product',
    brand: p.brands || '',
    image: p.image_front_small_url || p.image_url || null,
    nutriscoreGrade: p.nutriscore_grade || p.nutrition_grades || null,
    additivesTags: p.additives_tags || [],
    nutriments: p.nutriments || {},
    labels: p.labels_tags || [],
    categories: p.categories || '',
    quantity: p.quantity || '',
    ingredients: p.ingredients_text || p.ingredients_text_en || null,
    ingredientsTags: p.ingredients_tags || [],
    novaGroup: p.nova_group || null,
    ecoscore: p.ecoscore_grade || null,
    productType,
  }
}
