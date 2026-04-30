import additives from './additives.json'

const NUTRI_MAP = { a: 10, b: 0, c: -15, d: -30, e: -50 }

export function scoreProduct(product) {
  let score = 80
  let hasNutriScore = false

  // 1. Nutri-Score
  const nutri = product.nutriscoreGrade?.toLowerCase()
  if (nutri && NUTRI_MAP[nutri] !== undefined) {
    score += NUTRI_MAP[nutri]
    hasNutriScore = true
  } else {
    // No nutri-score — small penalty only, don't assume worst
    score -= 5
  }

  // 2. Additives
  for (const tag of product.additivesTags || []) {
    const entry = additives[tag]
    if (!entry) continue
    if (entry.risk === 3) score -= 12
    else if (entry.risk === 2) score -= 5
    else if (entry.risk === 1) score -= 1
  }

  // 3. Nutriments bonuses/penalties (only if data exists)
  const n = product.nutriments || {}
  if (Object.keys(n).length > 0) {
    if (n['sugars_100g'] > 20) score -= 8
    else if (n['sugars_100g'] > 10) score -= 4
    if (n['salt_100g'] > 1.5) score -= 8
    else if (n['salt_100g'] > 0.6) score -= 4
    if (n['saturated-fat_100g'] > 5) score -= 6
    if (n['fiber_100g'] > 3) score += 5
    if (n['proteins_100g'] > 10) score += 4
  }

  // 4. Organic bonus
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

export function getPositives(product) {
  const positives = []
  const n = product.nutriments || {}
  if (product.labels?.includes('en:organic')) positives.push('organic')
  if (n['fiber_100g'] > 3) positives.push('highFiber')
  if (n['proteins_100g'] > 10) positives.push('highProtein')
  if (n['sugars_100g'] < 5) positives.push('lowSugar')
  if (n['salt_100g'] < 0.3) positives.push('lowSalt')
  if (n['saturated-fat_100g'] < 1.5) positives.push('lowSatFat')
  const grade = (product.nutriscoreGrade || '').toLowerCase()
  if (grade === 'a') positives.push('nutriA')
  if (grade === 'b') positives.push('nutriB')
  return positives
}

export function getNegatives(product) {
  const negatives = []
  const n = product.nutriments || {}
  if (n['sugars_100g'] > 20) negatives.push('veryHighSugar')
  else if (n['sugars_100g'] > 10) negatives.push('highSugar')
  if (n['salt_100g'] > 1.5) negatives.push('veryHighSalt')
  else if (n['salt_100g'] > 0.6) negatives.push('highSalt')
  if (n['saturated-fat_100g'] > 5) negatives.push('highSatFat')
  if (n['energy-kcal_100g'] > 450) negatives.push('highCalories')
  for (const tag of product.additivesTags || []) {
    const entry = additives[tag]
    if (entry?.risk === 3) negatives.push('additive:' + tag)
  }
  const grade = (product.nutriscoreGrade || '').toLowerCase()
  if (grade === 'd') negatives.push('nutriD')
  if (grade === 'e') negatives.push('nutriE')
  return negatives
}

export function getAdditiveDetails(tags) {
  return (tags || [])
    .map(tag => {
      const entry = additives[tag]
      if (!entry) return null
      const eNum = tag.replace('en:', '').toUpperCase()
      return { code: eNum, name: entry.name, risk: entry.risk }
    })
    .filter(Boolean)
    .sort((a, b) => b.risk - a.risk)
}
