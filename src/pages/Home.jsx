import React, { useState } from 'react'
import { t, LANGUAGE_OPTIONS } from '../lib/i18n'

export default function Home({ onScan, lang, onLangChange }) {
  const T = t(lang)
  const [showLang, setShowLang] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  const currentLang = LANGUAGE_OPTIONS.find(l => l.code === lang)

  const handleShare = async () => {
    const url = 'https://esteves7771.github.io/Zai/'
    const text = T.share.text
    if (navigator.share) {
      try { await navigator.share({ title: 'Zai', text, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  return (
    <div className="page-enter" style={{
      flex: 1, overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px',
      background: '#ffffff',
      position: 'relative',
    }}>

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        {/* Language selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLang(!showLang)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 100,
              fontSize: 13,
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              color: 'var(--text)',
            }}
          >
            <span>{currentLang?.flag}</span>
            <span>{currentLang?.label}</span>
            <span style={{ fontSize: 10 }}>▼</span>
          </button>

          {showLang && (
            <div style={{
              position: 'absolute', top: '110%', left: 0,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100, minWidth: 160,
              overflow: 'hidden',
            }}>
              {LANGUAGE_OPTIONS.map(l => (
                <button
                  key={l.code}
                  onClick={() => { onLangChange(l.code); setShowLang(false) }}
                  style={{
                    width: '100%', padding: '11px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: l.code === lang ? 'var(--green-light)' : 'transparent',
                    color: l.code === lang ? 'var(--green-dark)' : 'var(--text)',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: l.code === lang ? 700 : 400,
                    fontSize: 14, textAlign: 'left',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span>{l.flag}</span> {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contact button */}
        <button
          onClick={() => setShowContact(true)}
          style={{
            padding: '6px 12px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 100,
            fontSize: 13,
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            color: 'var(--text)',
          }}
        >✉️ {T.contact}</button>
      </div>

      {/* Logo */}
      <div style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
        <img src="/Zai/logo.png" alt="Zai" style={{ width: 160, height: 160, objectFit: 'contain' }} />
      </div>

      {/* Tagline */}
      <div style={{ animation: 'fadeSlideUp 0.5s 0.1s ease both', textAlign: 'center', marginTop: 8 }}>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 260 }}>
          {T.tagline}
        </p>
      </div>

      {/* Pills */}
      <div style={{ animation: 'fadeSlideUp 0.5s 0.2s ease both', display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
        {T.pills.map(f => (
          <span key={f} style={{ padding: '6px 14px', background: 'var(--green-light)', color: 'var(--green-dark)', borderRadius: 100, fontSize: 13, fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>{f}</span>
        ))}
      </div>

      {/* Scan CTA */}
      <div style={{ animation: 'fadeSlideUp 0.5s 0.3s ease both', marginTop: 48, width: '100%' }}>
        <button onClick={onScan} style={{ width: '100%', padding: '16px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-lg)', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 17, boxShadow: '0 6px 20px rgba(45,80,22,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <ScanIcon /> {T.scan}
        </button>
      </div>

      {/* Share button */}
      <div style={{ animation: 'fadeSlideUp 0.5s 0.35s ease both', marginTop: 12, width: '100%' }}>
        <button onClick={handleShare} style={{ width: '100%', padding: '14px', background: 'transparent', color: 'var(--green-dark)', borderRadius: 'var(--radius-lg)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, border: '1.5px solid var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          📤 {shareCopied ? T.share.copied : T.share.text}
        </button>
      </div>

      {/* Footer */}
      <p style={{ animation: 'fadeSlideUp 0.5s 0.4s ease both', marginTop: 20, fontSize: 12, color: 'var(--text-light)', textAlign: 'center' }}>
        {T.powered}
      </p>

      {/* Contact modal */}
      {showContact && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowContact(false)}>
          <div style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', width: '100%', padding: '28px 24px 48px', animation: 'slideUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 20, marginBottom: 20 }}>✉️ {T.contact.title}</h3>
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '16px 18px', marginBottom: 16 }}>
              <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{T.contact.name}</p>
              <a href={`mailto:${T.contact.email}`} style={{ fontSize: 14, color: 'var(--green-dark)', textDecoration: 'none', fontWeight: 600 }}>{T.contact.email}</a>
            </div>
            <button onClick={() => setShowContact(false)} style={{ width: '100%', padding: '14px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15 }}>
              {T.contact.close}
            </button>
          </div>
        </div>
      )}

      {/* Lang backdrop */}
      {showLang && <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={() => setShowLang(false)} />}
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
