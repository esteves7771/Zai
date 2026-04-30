import React, { useEffect, useState } from 'react'
import ScoreRing from './ScoreRing'
import NutriBadge from './NutriBadge'
import { scoreProduct, getPositives, getNegatives, getAdditiveDetails } from '../lib/scoring'
import { addToHistory } from '../lib/history'

export default function ProductSheet({ product, onClose, onScanAgain, lang = 'en' }) {
  const [tab, setTab] = useState('overview')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    // Save to history when sheet opens
    if (product) {
      const s = scoreProduct(product)
      addToHistory(product, s)
    }
  }, [product])

  const close = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  if (!product) return null

  const score = scoreProduct(product)
  const positives = getPositives(product)
  const negatives = getNegatives(product)
  const additiveDetails = getAdditiveDetails(product.additivesTags)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'relative',
        background: 'var(--surface)',
        borderRadius: '28px 28px 0 0',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        overflow: 'hidden',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {/* Product image */}
          <div style={{
            width: 72, height: 72, borderRadius: 14,
            background: 'var(--surface-2)',
            overflow: 'hidden', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {product.image
              ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 36 }}>🥫</span>
            }
          </div>

          {/* Name + brand */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 800,
              fontSize: 17, lineHeight: 1.3, color: 'var(--text)',
            }}>{product.name}</div>
            {product.brand && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{product.brand}</div>
            )}
            {product.quantity && (
              <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>{product.quantity}</div>
            )}
            <div style={{ marginTop: 8 }}>
              <NutriBadge grade={product.nutriscoreGrade} size="sm" />
            </div>
          </div>

          {/* Score */}
          <ScoreRing score={score} size={80} lang={lang} />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          padding: '0 20px',
          gap: 4,
        }}>
          {['overview', 'additives', 'ingredients'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 14px',
                fontSize: 13,
                fontWeight: tab === t ? 700 : 400,
                color: tab === t ? 'var(--green-dark)' : 'var(--text-muted)',
                borderBottom: tab === t ? '2px solid var(--green-dark)' : '2px solid transparent',
                marginBottom: -1,
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
                fontFamily: 'Nunito, sans-serif',
              }}
            >{t}</button>
          ))}
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px 20px 32px' }}>

          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {positives.length > 0 && (
                <Section title="Positives" color="var(--score-green)" icon="✓">
                  {positives.map((p, i) => (
                    <ListItem key={i} color="var(--score-green)" text={p} />
                  ))}
                </Section>
              )}
              {negatives.length > 0 && (
                <Section title="Negatives" color="var(--score-red)" icon="✕">
                  {negatives.map((n, i) => (
                    <ListItem key={i} color="var(--score-red)" text={n} />
                  ))}
                </Section>
              )}
              {positives.length === 0 && negatives.length === 0 && (
                <Empty text="Not enough nutritional data available for this product." />
              )}
            </div>
          )}

          {tab === 'additives' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {additiveDetails.length === 0
                ? <Empty text="No additives found in this product. 🎉" />
                : additiveDetails.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px',
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <span style={{
                      fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                      fontSize: 12, color: 'var(--surface)',
                      background: a.risk === 3 ? 'var(--score-red)' : a.risk === 2 ? 'var(--score-orange)' : 'var(--score-green)',
                      padding: '2px 7px', borderRadius: 6,
                    }}>{a.code}</span>
                    <span style={{ flex: 1, fontSize: 14 }}>{a.name}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: a.risk === 3 ? 'var(--score-red)' : a.risk === 2 ? 'var(--score-orange)' : 'var(--score-green)',
                    }}>
                      {a.risk === 3 ? 'High risk' : a.risk === 2 ? 'Moderate' : 'Safe'}
                    </span>
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'ingredients' && (
            <div>
              {product.ingredients
                ? <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{product.ingredients}</p>
                : <Empty text="Ingredient list not available for this product." />
              }
            </div>
          )}
        </div>

        {/* CTA */}
        {onScanAgain && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => { close(); setTimeout(onScanAgain, 300) }}
              style={{
                width: '100%', padding: '14px',
                background: 'var(--green-dark)', color: '#fff',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 16,
              }}
            >Scan Another</button>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, color, icon, children }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: color, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, flexShrink: 0,
        }}>{icon}</div>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  )
}

function ListItem({ color, text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      background: 'var(--surface-2)',
      borderRadius: 'var(--radius-sm)',
      borderLeft: `3px solid ${color}`,
    }}>
      <span style={{ fontSize: 14 }}>{text}</span>
    </div>
  )
}

function Empty({ text }) {
  return (
    <div style={{
      textAlign: 'center', padding: '40px 20px',
      color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6,
    }}>{text}</div>
  )
}
