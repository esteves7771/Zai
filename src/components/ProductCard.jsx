import React from 'react'
import NutriBadge from './NutriBadge'
import { getScoreColor } from '../lib/scoring'
import { formatDate } from '../lib/history'

export default function ProductCard({ product, score, scannedAt, onClick }) {
  const color = getScoreColor(score)

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.98)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* Image */}
      <div style={{
        width: 52, height: 52, borderRadius: 10,
        background: 'var(--surface-2)',
        flexShrink: 0,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 24 }}>🥫</span>
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
          fontSize: 15,
          color: 'var(--text)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{product.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          {product.brand || 'Unknown brand'}
          {scannedAt && <span style={{ marginLeft: 8 }}>· {formatDate(scannedAt)}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <NutriBadge grade={product.nutriscoreGrade} size="sm" />
        </div>
      </div>

      {/* Score */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}>
        <span style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 900,
          fontSize: 22,
          color,
          lineHeight: 1,
        }}>{score}</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>/ 100</span>
      </div>
    </button>
  )
}
