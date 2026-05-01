const KEY = 'zai_history'
const MAX = 100

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addToHistory(product, score) {
  const history = getHistory()
  const entry = {
    id: `${product.barcode}_${Date.now()}`,
    barcode: product.barcode,
    name: product.name,
    brand: product.brand,
    image: product.image,
    score,
    nutriscoreGrade: product.nutriscoreGrade,
    ecoscoreGrade: product.ecoscoreGrade || null,
    scannedAt: new Date().toISOString(),
    additivesTags: product.additivesTags || [],
    nutriments: product.nutriments || {},
    labels: product.labels || [],
    ingredients: product.ingredients || null,
    quantity: product.quantity || '',
    productType: product.productType || 'food',
    novaGroup: product.novaGroup || null,
    allergensTags: product.allergensTags || [],
  }
  const filtered = history.filter(h => h.barcode !== product.barcode)
  const updated = [entry, ...filtered].slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export function clearHistory() {
  localStorage.removeItem(KEY)
}

export function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
