import React, { useState } from 'react'
import { t, LANGUAGE_OPTIONS } from '../lib/i18n'

export default function Home({ onScan, lang, onLangChange, onOpenAllergens }) {
  const T = t(lang)
  const [showLang, setShowLang] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  const currentLang = LANGUAGE_OPTIONS.find(l => l.code === lang)

  const handleShare = async () => {
    const url = 'https://esteves7771.github.io/Zai/'
    const shareText = T.share.text
    if (navigator.share) {
      try { await navigator.share({ title: 'Zai', text: shareText, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  const shareLabel = shareCopied ? T.share.copied : T.share.title
  const P = T.privacy || {}

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
      <div style={{ position: 'absolute', top: 16, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>

        {/* Language selector - LEFT */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setShowLang(!showLang)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 100, fontSize: 13, fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text)' }}
          >
            <span>{currentLang ? currentLang.flag : '🇬🇧'}</span>
            <span>{currentLang ? currentLang.label : 'English'}</span>
            <span style={{ fontSize: 10 }}>▼</span>
          </button>
          {showLang && (
            <div style={{ position: 'absolute', top: '110%', left: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 100, minWidth: 170, overflow: 'hidden' }}>
              {LANGUAGE_OPTIONS.map(l => (
                <button key={l.code} onClick={() => { onLangChange(l.code); setShowLang(false) }}
                  style={{ width: '100%', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, background: l.code === lang ? 'var(--green-light)' : 'transparent', color: l.code === lang ? 'var(--green-dark)' : 'var(--text)', fontFamily: 'Nunito, sans-serif', fontWeight: l.code === lang ? 700 : 400, fontSize: 14, textAlign: 'left', borderBottom: '1px solid var(--border)' }}
                >
                  <span>{l.flag}</span><span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Allergens - CENTER */}
        <button onClick={onOpenAllergens}
          style={{ padding: '6px 12px', background: 'var(--red-light)', border: '1px solid var(--score-red)', borderRadius: 100, fontSize: 12, fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--score-red)', flexShrink: 0 }}
        >🚨 {T.allergens?.button || 'Allergens'}</button>

        {/* Contact - RIGHT */}
        <button onClick={() => setShowContact(true)}
          style={{ padding: '6px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 100, fontSize: 13, fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text)', flexShrink: 0 }}
        >
          <span>✉️ </span><span>{T.contact.title}</span>
        </button>
      </div>

      {/* Lang backdrop */}
      {showLang && <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} onClick={() => setShowLang(false)} />}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{children}</p>
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
