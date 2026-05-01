const KEY = 'zai_favorites'

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addFavorite(product, score) {
  const favorites = getFavorites()
  const entry = {
    id: product.barcode || Date.now().toString(),
    barcode: product.barcode,
    name: product.name,
    brand: product.brand,
    image: product.image,
    score,
    nutriscoreGrade: product.nutriscoreGrade,
    additivesTags: product.additivesTags || [],
    nutriments: product.nutriments || {},
    labels: product.labels || [],
    ingredients: product.ingredients || null,
    quantity: product.quantity || '',
    productType: product.productType || 'food',
    savedAt: new Date().toISOString(),
  }
  const filtered = favorites.filter(f => f.barcode !== product.barcode)
  localStorage.setItem(KEY, JSON.stringify([entry, ...filtered]))
}

export function removeFavorite(barcode) {
  const favorites = getFavorites()
  localStorage.setItem(KEY, JSON.stringify(favorites.filter(f => f.barcode !== barcode)))
}

export function isFavorite(barcode) {
  return getFavorites().some(f => f.barcode === barcode)
}
