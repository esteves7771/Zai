import React from 'react'
import { getScoreColor, getScoreLabel } from '../lib/scoring'

export default function ScoreRing({ score, size = 96 }) {
  const color = getScoreColor(score)
  const label = getScoreLabel(score)
  const r = (size / 2) - 6
  const circ = 2 * Math.PI * r
  const filled = (score / 100) * circ

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={6} />
          <circle
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circ}`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 900,
            fontSize: size * 0.26,
            color,
            lineHeight: 1,
          }}>{score}</span>
          <span style={{ fontSize: size * 0.13, color: 'var(--text-muted)', lineHeight: 1.2 }}>/ 100</span>
        </div>
      </div>
      <span style={{
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 700,
        fontSize: 13,
        color,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  )
}
