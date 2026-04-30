const BASE = 'https://world.openfoodfacts.org'

export async function fetchByBarcode(barcode) {
  const res = await fetch(`${BASE}/api/v2/product/${barcode}.json`)
  if (!res.ok) throw new Error('Network error')
  const data = await res.json()
  if (data.status === 0) return null
  return normalizeProduct(data.product)
}

export async function searchProducts(query) {
  const url = `${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true&page_size=20&fields=code,product_name,brands,image_front_small_url,nutriscore_grade,additives_tags,nutrition_grades`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Network error')
  const data = await res.json()
  return (data.products || [])
    .filter(p => p.product_name)
    .map(normalizeProduct)
}

function normalizeProduct(p) {
  return {
    barcode: p.code || p._id || '',
    name: p.product_name || p.product_name_en || 'Unknown Product',
    brand: p.brands || '',
    image: p.image_front_small_url || p.image_url || null,
    nutriscoreGrade: p.nutriscore_grade || p.nutrition_grades || null,
    additivesTags: p.additives_tags || [],
    additivesOriginal: p.additives_original_tags || [],
    nutriments: p.nutriments || {},
    labels: p.labels_tags || [],
    categories: p.categories || '',
    quantity: p.quantity || '',
    ingredients: p.ingredients_text || p.ingredients_text_en || null,
    novaGroup: p.nova_group || null,
    ecoscore: p.ecoscore_grade || null,
  }
}
