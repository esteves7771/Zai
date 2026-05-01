import React, { useState } from 'react'

const SLIDES = [
  {
    emoji: '🥭',
    title: 'Welcome to Zai',
    body: 'Know exactly what you eat and what you put on your skin. Scan any product barcode to get an instant health score.',
  },
  {
    emoji: '📷',
    title: 'Scan in seconds',
    body: 'Point your camera at any barcode. Zai checks 3 million+ food and cosmetic products instantly — no account needed.',
  },
  {
    emoji: '📊',
    title: 'Understand your score',
    body: 'Your score (0-100) combines Nutri-Score, additive risks and processing level. Green is good. Red means avoid.',
  },
]

export default function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0)

  const next = () => {
    if (slide < SLIDES.length - 1) setSlide(slide + 1)
    else onDone()
  }

  const s = SLIDES[slide]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: '#fff',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px',
    }}>
      {/* Skip */}
      <button
        onClick={onDone}
        style={{ position: 'absolute', top: 20, right: 20, fontSize: 14, color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}
      >Skip</button>

      {/* Slide content */}
      <div key={slide} style={{ textAlign: 'center', animation: 'fadeSlideUp 0.3s ease both' }}>
        <div style={{ fontSize: 80, marginBottom: 32 }}>{s.emoji}</div>
        <h2 style={{
          fontFamily: 'Nunito, sans-serif', fontWeight: 900,
          fontSize: 26, color: 'var(--text)', marginBottom: 16, lineHeight: 1.2,
        }}>{s.title}</h2>
        <p style={{
          fontSize: 16, color: 'var(--text-muted)',
          lineHeight: 1.7, maxWidth: 280, margin: '0 auto',
        }}>{s.body}</p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 48 }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: i === slide ? 24 : 8, height: 8,
            borderRadius: 4,
            background: i === slide ? 'var(--green-dark)' : 'var(--border)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Next / Get started */}
      <button
        onClick={next}
        style={{
          marginTop: 32, width: '100%',
          padding: '16px',
          background: 'var(--green-dark)', color: '#fff',
          borderRadius: 'var(--radius-lg)',
          fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 17,
          boxShadow: '0 6px 20px rgba(45,80,22,0.30)',
        }}
      >
        {slide < SLIDES.length - 1 ? 'Next' : 'Get Started'}
      </button>
    </div>
  )
}
