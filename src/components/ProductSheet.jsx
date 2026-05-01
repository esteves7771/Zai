import React, { useEffect, useState } from 'react'
import ScoreRing from './ScoreRing'
import NutriBadge from './NutriBadge'
import { scoreProduct, getPositives, getNegatives, getAdditiveDetails, getSmartAlert, getCosmeticIngredientDetails } from '../lib/scoring'
import { addToHistory } from '../lib/history'
import { addFavorite, removeFavorite, isFavorite } from '../lib/favorites'
import { t } from '../lib/i18n'
import additives from '../lib/additives.json'

const POSITIVE_EXPLANATIONS = {
  organic: { icon: '🌱', key: 'pos_organic', detail: 'pos_organic_detail' },
  highFiber: { icon: '🌾', key: 'pos_fiber', detail: 'pos_fiber_detail' },
  goodFiber: { icon: '🌾', key: 'pos_goodFiber', detail: 'pos_fiber_detail' },
  highProtein: { icon: '💪', key: 'pos_protein', detail: 'pos_protein_detail' },
  goodProtein: { icon: '💪', key: 'pos_goodProtein', detail: 'pos_protein_detail' },
  lowSugar: { icon: '🍬', key: 'pos_lowSugar', detail: 'pos_lowSugar_detail' },
  lowSalt: { icon: '🧂', key: 'pos_lowSalt', detail: 'pos_lowSalt_detail' },
  lowSatFat: { icon: '🧈', key: 'pos_lowSatFat', detail: 'pos_lowSatFat_detail' },
  nutriA: { icon: '🥗', key: 'pos_nutriA', detail: 'pos_nutriA_detail' },
  nutriB: { icon: '🥗', key: 'pos_nutriB', detail: 'pos_nutriB_detail' },
  nova1: { icon: '🌿', key: 'pos_nova1', detail: 'pos_nova1_detail' },
  nova2: { icon: '🌿', key: 'pos_nova2', detail: 'pos_nova2_detail' },
  vegan: { icon: '🌱', key: 'pos_vegan', detail: 'pos_vegan_detail' },
  crueltyFree: { icon: '🐇', key: 'pos_crueltyFree', detail: 'pos_crueltyFree_detail' },
  aloeVera: { icon: '🌿', key: 'pos_aloeVera', detail: 'pos_aloeVera_detail' },
  hyaluronicAcid: { icon: '💧', key: 'pos_hyaluronicAcid', detail: 'pos_hyaluronicAcid_detail' },
  noHighRiskIngredients: { icon: '✅', key: 'pos_noHighRiskIngredients', detail: 'pos_noHighRiskIngredients_detail' },
}

const NEGATIVE_EXPLANATIONS = {
  veryHighSugar: { icon: '🍬', key: 'neg_veryHighSugar', detail: 'neg_veryHighSugar_detail' },
  highSugar: { icon: '🍬', key: 'neg_highSugar', detail: 'neg_highSugar_detail' },
  veryHighSalt: { icon: '🧂', key: 'neg_veryHighSalt', detail: 'neg_veryHighSalt_detail' },
  highSalt: { icon: '🧂', key: 'neg_highSalt', detail: 'neg_highSalt_detail' },
  highSatFat: { icon: '🧈', key: 'neg_highSatFat', detail: 'neg_highSatFat_detail' },
  highCalories: { icon: '🔥', key: 'neg_highCalories', detail: 'neg_highCalories_detail' },
  nutriD: { icon: '🥗', key: 'neg_nutriD', detail: 'neg_nutriD_detail' },
  nutriE: { icon: '🥗', key: 'neg_nutriE', detail: 'neg_nutriE_detail' },
  nova4: { icon: '🏭', key: 'neg_nova4', detail: 'neg_nova4_detail' },
  nova3: { icon: '🏭', key: 'neg_nova3', detail: 'neg_nova3_detail' },
}

export default function ProductSheet({ product, onClose, onScanAgain, lang = 'en' }) {
  const [tab, setTab] = useState('overview')
  const [visible, setVisible] = useState(false)
  const [fav, setFav] = useState(false)
  const T = t(lang)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    if (product) {
      const s = scoreProduct(product)
      addToHistory(product, s)
      setFav(isFavorite(product.barcode))
    }
  }, [product])

  const close = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  const toggleFav = () => {
    if (fav) {
      removeFavorite(product.barcode)
      setFav(false)
    } else {
      addFavorite(product, scoreProduct(product))
      setFav(true)
    }
  }

  if (!product) return null

  const score = scoreProduct(product)
  const positives = getPositives(product)
  const negatives = getNegatives(product)
  const alert = getSmartAlert(product)
  const isCosmetic = product.productType === 'cosmetic'
  const additiveDetails = getAdditiveDetails(product.additivesTags)
  const cosmeticDetails = isCosmetic ? getCosmeticIngredientDetails(product) : []

  const resolvePositive = (key) => {
    if (key.startsWith('cosmetic:')) {
      const parts = key.split(':')
      return { icon: '✅', label: parts[1], detail: '' }
    }
    const meta = POSITIVE_EXPLANATIONS[key]
    if (!meta) return { icon: '✓', label: key, detail: '' }
    return {
      icon: meta.icon,
      label: T.sheet[meta.key] || key,
      detail: T.sheet[meta.detail] || '',
    }
  }

  const resolveNegative = (key) => {
    if (key.startsWith('additive:')) {
      const tag = key.replace('additive:', '')
      const entry = additives[tag]
      return { icon: '⚗️', label: (T.sheet.contains || 'Contains') + ' ' + (entry?.name || tag), detail: T.sheet.neg_additive_detail || 'This additive is classified as high risk.' }
    }
    if (key.startsWith('cosmetic:')) {
      const parts = key.split(':')
      const inci = parts[1]
      const risk = parseInt(parts[2])
      return { icon: risk === 3 ? '⛔' : '⚠️', label: inci, detail: risk === 3 ? 'High risk cosmetic ingredient.' : 'Potentially concerning ingredient.' }
    }
    const meta = NEGATIVE_EXPLANATIONS[key]
    if (!meta) return { icon: '✕', label: key, detail: '' }
    return {
      icon: meta.icon,
      label: T.sheet[meta.key] || key,
      detail: T.sheet[meta.detail] || '',
    }
  }

  const alertColors = { danger: '#E53935', warning: '#FF7043', info: '#F5A623' }
  const alertBg = { danger: '#fdecea', warning: '#fff3f0', info: '#fff8ee' }

  const resolveAlertMessage = (alert) => {
    if (!alert) return ''
    const map = {
      multipleHighRiskAdditives: T.sheet.alert_multipleAdditives || 'Contains multiple high-risk additives.',
      highRiskAdditive: (T.sheet.alert_highRiskAdditive || 'Contains {name}.').replace('{name}', alert.additive || ''),
      ultraProcessed: T.sheet.alert_ultraProcessed || 'Ultra-processed food with poor nutritional profile.',
      ultraProcessedInfo: T.sheet.alert_ultraProcessedInfo || 'This is an ultra-processed food (NOVA group 4).',
      cosmeticMultipleHighRisk: T.sheet.alert_cosmeticMultiple || 'Contains multiple high-risk ingredients.',
      cosmeticHighRisk: (T.sheet.alert_cosmeticHighRisk || 'Contains {name}, a high-risk ingredient.').replace('{name}', alert.ingredient || ''),
    }
    return map[alert.message] || ''
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease', backdropFilter: 'blur(4px)' }} />

      <div style={{ position: 'relative', background: 'var(--surface)', borderRadius: '28px 28px 0 0', maxHeight: '92vh', display: 'flex', flexDirection: 'column', transform: visible ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)', overflow: 'hidden' }}>

        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {/* Smart Alert */}
        {alert && (
          <div style={{ margin: '0 16px 8px', padding: '10px 14px', background: alertBg[alert.type], borderRadius: 12, borderLeft: `3px solid ${alertColors[alert.type]}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>{alert.type === 'danger' ? '⛔' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span style={{ fontSize: 13, color: alertColors[alert.type], fontWeight: 600, lineHeight: 1.4 }}>{resolveAlertMessage(alert)}</span>
          </div>
        )}

        {/* Header */}
        <div style={{ padding: '4px 16px 12px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 68, height: 68, borderRadius: 12, background: 'var(--surface-2)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.image
              ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 32 }}>{isCosmetic ? '🧴' : '🥫'}</span>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 16, lineHeight: 1.3, color: 'var(--text)' }}>{product.name}</div>
            {product.brand && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{product.brand}</div>}
            {product.quantity && <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>{product.quantity}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              {isCosmetic
                ? <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green-dark)', background: 'var(--green-light)', padding: '2px 8px', borderRadius: 100 }}>Cosmetic</span>
                : <NutriBadge grade={product.nutriscoreGrade} size="sm" />
              }
              {/* Favorite button */}
              <button onClick={toggleFav} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>
                {fav ? '⭐' : '☆'}
              </button>
            </div>
          </div>
          <ScoreRing score={score} size={78} lang={lang} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 16px', gap: 4 }}>
          {['overview', isCosmetic ? 'ingredients' : 'additives', isCosmetic ? 'additives' : 'ingredients'].map(tabKey => (
            <button key={tabKey} onClick={() => setTab(tabKey)} style={{ padding: '10px 12px', fontSize: 13, fontWeight: tab === tabKey ? 700 : 400, color: tab === tabKey ? 'var(--green-dark)' : 'var(--text-muted)', borderBottom: tab === tabKey ? '2px solid var(--green-dark)' : '2px solid transparent', marginBottom: -1, textTransform: 'capitalize', transition: 'all 0.15s ease', fontFamily: 'Nunito, sans-serif' }}>
              {tabKey === 'overview' ? T.sheet.overview : tabKey === 'additives' ? T.sheet.additives : T.sheet.ingredients}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '16px 16px 32px' }}>

          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {positives.length > 0 && (
                <Section title={T.sheet.positives} color="var(--score-green)" icon="✓">
                  {positives.map((key, i) => {
                    const r = resolvePositive(key)
                    return <ExplainItem key={i} color="var(--score-green)" icon={r.icon} label={r.label} detail={r.detail} />
                  })}
                </Section>
              )}
              {negatives.length > 0 && (
                <Section title={T.sheet.negatives} color="var(--score-red)" icon="✕">
                  {negatives.map((key, i) => {
                    const r = resolveNegative(key)
                    return <ExplainItem key={i} color="var(--score-red)" icon={r.icon} label={r.label} detail={r.detail} />
                  })}
                </Section>
              )}
              {positives.length === 0 && negatives.length === 0 && (
                <Empty text={T.sheet.noData} />
              )}
            </div>
          )}

          {tab === 'additives' && !isCosmetic && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {additiveDetails.length === 0
                ? <Empty text={T.sheet.noAdditives} />
                : additiveDetails.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 11, color: '#fff', background: a.risk === 3 ? 'var(--score-red)' : a.risk === 2 ? 'var(--score-orange)' : 'var(--score-green)', padding: '2px 6px', borderRadius: 6, flexShrink: 0 }}>{a.code}</span>
                    <span style={{ flex: 1, fontSize: 13 }}>{a.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: a.risk === 3 ? 'var(--score-red)' : a.risk === 2 ? 'var(--score-orange)' : 'var(--score-green)', flexShrink: 0 }}>
                      {a.risk === 3 ? T.sheet.highRisk : a.risk === 2 ? T.sheet.moderate : T.sheet.safe}
                    </span>
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'additives' && isCosmetic && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cosmeticDetails.length === 0
                ? <Empty text="No concerning ingredients detected." />
                : cosmeticDetails.map((ing, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{ing.risk === 3 ? '⛔' : ing.risk === 2 ? '⚠️' : '✅'}</span>
                    <span style={{ flex: 1, fontSize: 13 }}>{ing.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: ing.risk === 3 ? 'var(--score-red)' : ing.risk === 2 ? 'var(--score-orange)' : 'var(--score-green)', flexShrink: 0 }}>
                      {ing.risk === 3 ? T.sheet.highRisk : ing.risk === 2 ? T.sheet.moderate : T.sheet.safe}
                    </span>
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'ingredients' && (
            <div>
              {product.ingredients
                ? <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text)' }}>{product.ingredients}</p>
                : <Empty text={T.sheet.noIngredients} />
              }
            </div>
          )}
        </div>

        {/* CTA */}
        {onScanAgain && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
            <button onClick={() => { close(); setTimeout(onScanAgain, 300) }} style={{ width: '100%', padding: '13px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 15 }}>
              {T.scan_page.scanAnother}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, color, icon, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{icon}</div>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  )
}

function ExplainItem({ color, icon, label, detail }) {
  return (
    <div style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
      </div>
      {detail ? <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, marginLeft: 24, lineHeight: 1.5 }}>{detail}</p> : null}
    </div>
  )
}

function Empty({ text }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{text}</div>
  )
}
