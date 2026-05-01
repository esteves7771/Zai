import React from 'react'

const COLORS = {
  a: { bg: '#1a7a3f', text: '#fff' },
  b: { bg: '#85bb2f', text: '#fff' },
  c: { bg: '#f9c623', text: '#333' },
  d: { bg: '#e07823', text: '#fff' },
  e: { bg: '#e63b11', text: '#fff' },
}

export default function EcoBadge({ grade, size = 'md' }) {
  if (!grade) return null
  const g = grade.toLowerCase()
  if (!COLORS[g]) return null
  const style = COLORS[g]
  const sizes = { sm: { w: 24, h: 24, fs: 11 }, md: { w: 32, h: 32, fs: 14 } }
  const s = sizes[size] || sizes.md
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{
        width: s.w, height: s.h, borderRadius: 6,
        background: style.bg, color: style.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Nunito, sans-serif', fontWeight: 900,
        fontSize: s.fs, textTransform: 'uppercase', flexShrink: 0,
      }}>{g}</div>
      <span style={{ fontSize: 9, color: 'var(--text-light)', fontWeight: 600 }}>ECO</span>
    </div>
  )
}
