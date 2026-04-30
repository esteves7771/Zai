import React from 'react'

export default function Home({ onScan }) {
  return (
    <div className="page-enter" style={{
      flex: 1, overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px',
      gap: 0,
    }}>
      {/* Logo */}
      <div style={{
        animation: 'fadeSlideUp 0.5s ease both',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <img
          src="/logo.png"
          alt="Zai"
          style={{ width: 140, height: 140, objectFit: 'contain' }}
        />
      </div>

      {/* Tagline */}
      <div style={{
        animation: 'fadeSlideUp 0.5s 0.1s ease both',
        textAlign: 'center', marginTop: 8,
      }}>
        <p style={{
          fontSize: 15,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          maxWidth: 240,
        }}>
          Know exactly what you're eating. Scan, search, decide.
        </p>
      </div>

      {/* Feature pills */}
      <div style={{
        animation: 'fadeSlideUp 0.5s 0.2s ease both',
        display: 'flex', gap: 8, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {['🔬 Additives', '🥗 Nutri-Score', '📊 Full Score'].map(f => (
          <span key={f} style={{
            padding: '6px 14px',
            background: 'var(--green-light)',
            color: 'var(--green-dark)',
            borderRadius: 100,
            fontSize: 13,
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
          }}>{f}</span>
        ))}
      </div>

      {/* CTA */}
      <div style={{ animation: 'fadeSlideUp 0.5s 0.3s ease both', marginTop: 48, width: '100%' }}>
        <button
          onClick={onScan}
          style={{
            width: '100%',
            padding: '16px',
            background: 'var(--green-dark)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 800,
            fontSize: 17,
            boxShadow: '0 6px 20px rgba(45,80,22,0.30)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <ScanIcon /> Scan a Product
        </button>
      </div>

      {/* Footer note */}
      <p style={{
        animation: 'fadeSlideUp 0.5s 0.4s ease both',
        marginTop: 24,
        fontSize: 12,
        color: 'var(--text-light)',
        textAlign: 'center',
      }}>
        Powered by Open Food Facts · 3M+ products
      </p>
    </div>
  )
}

function ScanIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
    </svg>
  )
}
