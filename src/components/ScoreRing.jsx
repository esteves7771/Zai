import React, { useState } from 'react'
import { getScoreColor, getScoreLabel } from '../lib/scoring'
import { t } from '../lib/i18n'

export default function ScoreRing({ score, size = 96, lang = 'en' }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const T = t(lang)
  const color = getScoreColor(score)
  const label = T.score[getScoreLabel(score).toLowerCase()] || getScoreLabel(score)
  const r = (size / 2) - 6
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
      <button onClick={() => setShowTooltip(true)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={6} />
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${filled} ${circ}`} style={{ transition: 'stroke-dasharray 0.6s ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: size * 0.26, color, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: size * 0.13, color: 'var(--text-muted)', lineHeight: 1.2 }}>/ 100</span>
          </div>
        </div>
        <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 13, color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: 10, color: 'var(--text-light)' }}>ⓘ tap for details</span>
      </button>

      {/* Tooltip modal */}
      {showTooltip && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowTooltip(false)}>
          <div style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', width: '100%', padding: '28px 24px 48px', animation: 'slideUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 20 }}>{T.score.tooltip.title}</h3>
            {[
              { icon: '🥗', text: T.score.tooltip.nutri },
              { icon: '⚗️', text: T.score.tooltip.additives },
              { icon: '🌱', text: T.score.tooltip.organic },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text)' }}>{item.text}</p>
              </div>
            ))}
            <button onClick={() => setShowTooltip(false)} style={{ width: '100%', padding: '14px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, marginTop: 8 }}>
              {T.score.tooltip.close}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
