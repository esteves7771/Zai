import additives from './additives.json'
import cosmeticIngredientsList from './cosmetic-ingredients.json'

const NUTRI_MAP = { a: 25, b: 10, c: -10, d: -30, e: -55 }
const NOVA_MAP  = { 1: 15, 2: 5, 3: -10, 4: -25 }

export function scoreProduct(product) {
  if (product.productType === 'cosmetic') return scoreCosmeticProduct(product)
  let score = 65
  const nutri = product.nutriscoreGrade?.toLowerCase()
  if (nutri && NUTRI_MAP[nutri] !== undefined) score += NUTRI_MAP[nutri]
  else score -= 5
  const nova = parseInt(product.novaGroup)
  if (!isNaN(nova) && NOVA_MAP[nova] !== undefined) score += NOVA_MAP[nova]
  for (const tag of product.additivesTags || []) {
    const entry = additives[tag]
    if (!entry) continue
    if (entry.risk === 3) score -= 15
    else if (entry.risk === 2) score -= 6
    else if (entry.risk === 1) score -= 1
  }
  const n = product.nutriments || {}
  if (Object.keys(n).length > 0) {
    if (n['sugars_100g'] > 22) score -= 12
    else if (n['sugars_100g'] > 12) score -= 6
    if (n['salt_100g'] > 1.5) score -= 10
    else if (n['salt_100g'] > 0.6) score -= 5
    if (n['saturated-fat_100g'] > 5) score -= 8
    if (n['fiber_100g'] > 5) score += 8
    else if (n['fiber_100g'] > 3) score += 4
    if (n['proteins_100g'] > 15) score += 6
    else if (n['proteins_100g'] > 8) score += 3
  }
  if (product.labels?.includes('en:organic')) score += 8
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function getScoreColor(score) {
  if (score >= 75) return 'var(--score-green)'
  if (score >= 50) return 'var(--score-yellow)'
  if (score >= 25) return 'var(--score-orange)'
  return 'var(--score-red)'
}

export function getScoreLabel(score) {
  if (score >= 75) return 'excellent'
  if (score >= 50) return 'ok'
  if (score >= 25) return 'poor'
  return 'avoid'
}

export function getSmartAlert(product) {
  if (product.productType === 'cosmetic') return getCosmeticAlert(product)
  const highRiskAdditives = (product.additivesTags || []).filter(tag => additives[tag]?.risk === 3)
  const nova = parseInt(product.novaGroup)
  const nutri = (product.nutriscoreGrade || '').toLowerCase()
  if (highRiskAdditives.length >= 2) return { type: 'danger', message: 'multipleHighRiskAdditives' }
  if (highRiskAdditives.length === 1) return { type: 'warning', message: 'highRiskAdditive', additive: additives[highRiskAdditives[0]]?.name }
  if (nova === 4 && (nutri === 'd' || nutri === 'e')) return { type: 'warning', message: 'ultraProcessed' }
  if (nova === 4) return { type: 'info', message: 'ultraProcessedInfo' }
  return null
}

export function getPositives(product) {
  if (product.productType === 'cosmetic') return getCosmeticPositives(product)
  const positives = []
  const n = product.nutriments || {}
  if (product.labels?.includes('en:organic')) positives.push('organic')
  if (n['fiber_100g'] > 5) positives.push('highFiber')
  else if (n['fiber_100g'] > 3) positives.push('goodFiber')
  if (n['proteins_100g'] > 15) positives.push('highProtein')
  else if (n['proteins_100g'] > 8) positives.push('goodProtein')
  if (n['sugars_100g'] < 5) positives.push('lowSugar')
  if (n['salt_100g'] < 0.3) positives.push('lowSalt')
  if (n['saturated-fat_100g'] < 1.5) positives.push('lowSatFat')
  const grade = (product.nutriscoreGrade || '').toLowerCase()
  if (grade === 'a') positives.push('nutriA')
  if (grade === 'b') positives.push('nutriB')
  const nova = parseInt(product.novaGroup)
  if (nova === 1) positives.push('nova1')
  if (nova === 2) positives.push('nova2')
  return positives
}

export function getNegatives(product) {
  if (product.productType === 'cosmetic') return getCosmeticNegatives(product)
  const negatives = []
  const n = product.nutriments || {}
  if (n['sugars_100g'] > 22) negatives.push('veryHighSugar')
  else if (n['sugars_100g'] > 12) negatives.push('highSugar')
  if (n['salt_100g'] > 1.5) negatives.push('veryHighSalt')
  else if (n['salt_100g'] > 0.6) negatives.push('highSalt')
  if (n['saturated-fat_100g'] > 5) negatives.push('highSatFat')
  if (n['energy-kcal_100g'] > 500) negatives.push('highCalories')
  for (const tag of product.additivesTags || []) {
    if (additives[tag]?.risk === 3) negatives.push('additive:' + tag)
  }
  const grade = (product.nutriscoreGrade || '').toLowerCase()
  if (grade === 'd') negatives.push('nutriD')
  if (grade === 'e') negatives.push('nutriE')
  const nova = parseInt(product.novaGroup)
  if (nova === 4) negatives.push('nova4')
  else if (nova === 3) negatives.push('nova3')
  return negatives
}

export function getAdditiveDetails(tags) {
  return (tags || [])
    .map(tag => {
      const entry = additives[tag]
      if (!entry) return null
      return { code: tag.replace('en:', '').toUpperCase(), name: entry.name, risk: entry.risk }
    })
    .filter(Boolean)
    .sort((a, b) => b.risk - a.risk)
}

export function scoreCosmeticProduct(product) {
  let score = 80
  const ingredients = (product.ingredients || '').toLowerCase()
  for (const ing of cosmeticIngredientsList) {
    if (ingredients.includes(ing.inci.toLowerCase())) {
      if (ing.risk === 3) score -= 18
      else if (ing.risk === 2) score -= 8
      else if (ing.risk === 1) score -= 2
    }
  }
  if (product.labels?.some(l => l.includes('organic') || l.includes('natural'))) score += 8
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function getCosmeticPositives(product) {
  const positives = []
  const ingredients = (product.ingredients || '').toLowerCase()
  if (product.labels?.some(l => l.includes('organic'))) positives.push('organic')
  if (product.labels?.some(l => l.includes('vegan'))) positives.push('vegan')
  if (product.labels?.some(l => l.includes('cruelty-free'))) positives.push('crueltyFree')
  if (ingredients.includes('aloe vera')) positives.push('aloeVera')
  if (ingredients.includes('hyaluronic acid')) positives.push('hyaluronicAcid')
  const hasHighRisk = cosmeticIngredientsList.some(ing => ing.risk === 3 && ingredients.includes(ing.inci.toLowerCase()))
  if (!hasHighRisk) positives.push('noHighRiskIngredients')
  return positives
}

export function getCosmeticNegatives(product) {
  const negatives = []
  const ingredients = (product.ingredients || '').toLowerCase()
  for (const ing of cosmeticIngredientsList) {
    if (ing.risk >= 2 && ingredients.includes(ing.inci.toLowerCase())) {
      negatives.push('cosmetic:' + ing.inci + ':' + ing.risk)
    }
  }
  return negatives.slice(0, 6)
}

export function getCosmeticAlert(product) {
  const ingredients = (product.ingredients || '').toLowerCase()
  const highRisk = cosmeticIngredientsList.filter(ing => ing.risk === 3 && ingredients.includes(ing.inci.toLowerCase()))
  if (highRisk.length >= 2) return { type: 'danger', message: 'cosmeticMultipleHighRisk' }
  if (highRisk.length === 1) return { type: 'warning', message: 'cosmeticHighRisk', ingredient: highRisk[0].name }
  return null
}

export function getCosmeticIngredientDetails(product) {
  const ingredients = (product.ingredients || '').toLowerCase()
  return cosmeticIngredientsList
    .filter(ing => ingredients.includes(ing.inci.toLowerCase()))
    .sort((a, b) => b.risk - a.risk)
}
