import additives from './additives.json'

const NUTRI_MAP = { a: 0, b: -10, c: -25, d: -40, e: -60 }

export function scoreProduct(product) {
  let score = 100

  // 1. Nutri-Score
  const nutri = product.nutriscoreGrade?.toLowerCase()
  score += NUTRI_MAP[nutri] ?? -20

  // 2. Additives
  for (const tag of product.additivesTags) {
    const entry = additives[tag]
    if (!entry) continue
    if (entry.risk === 3) score -= 15
    else if (entry.risk === 2) score -= 7
    else if (entry.risk === 1) score -= 2
  }

  // 3. Organic bonus
  if (product.labels?.includes('en:organic')) score += 10

  return Math.max(0, Math.min(100, Math.round(score)))
}

export function getScoreColor(score) {
  if (score >= 75) return 'var(--score-green)'
  if (score >= 50) return 'var(--score-yellow)'
  if (score >= 25) return 'var(--score-orange)'
  return 'var(--score-red)'
}

export function getScoreLabel(score) {
  if (score >= 75) return 'Excellent'
  if (score >= 50) return 'OK'
  if (score >= 25) return 'Poor'
  return 'Avoid'
}

export function getPositives(product) {
  const positives = []
  const n = product.nutriments || {}
  if (product.labels?.includes('en:organic')) positives.push('Organic certified')
  if (n['fiber_100g'] > 3) positives.push('High in fiber')
  if (n['proteins_100g'] > 10) positives.push('Good source of protein')
  if (n['sugars_100g'] < 5) positives.push('Low in sugar')
  if (n['salt_100g'] < 0.3) positives.push('Low in salt')
  if (n['saturated-fat_100g'] < 1.5) positives.push('Low saturated fat')
  if ((product.nutriscoreGrade || '').toLowerCase() === 'a') positives.push('Excellent Nutri-Score A')
  if ((product.nutriscoreGrade || '').toLowerCase() === 'b') positives.push('Good Nutri-Score B')
  return positives
}

export function getNegatives(product) {
  const negatives = []
  const n = product.nutriments || {}
  if (n['sugars_100g'] > 20) negatives.push('Very high in sugar')
  else if (n['sugars_100g'] > 10) negatives.push('High in sugar')
  if (n['salt_100g'] > 1.5) negatives.push('Very high in salt')
  else if (n['salt_100g'] > 0.6) negatives.push('High in salt')
  if (n['saturated-fat_100g'] > 5) negatives.push('High saturated fat')
  if (n['energy-kcal_100g'] > 450) negatives.push('Very high calories')

  // Risky additives
  for (const tag of product.additivesTags) {
    const entry = additives[tag]
    if (entry?.risk === 3) negatives.push(`Contains ${entry.name}`)
  }

  const grade = (product.nutriscoreGrade || '').toLowerCase()
  if (grade === 'd') negatives.push('Poor Nutri-Score D')
  if (grade === 'e') negatives.push('Very poor Nutri-Score E')

  return negatives
}

export function getAdditiveDetails(tags) {
  return tags
    .map(tag => {
      const entry = additives[tag]
      if (!entry) return null
      const eNum = tag.replace('en:', '').toUpperCase()
      return { code: eNum, name: entry.name, risk: entry.risk }
    })
    .filter(Boolean)
    .sort((a, b) => b.risk - a.risk)
}
