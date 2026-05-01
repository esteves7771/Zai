import React, { useState } from 'react'
import { t, LANGUAGE_OPTIONS } from '../lib/i18n'

export default function Home({ onScan, lang, onLangChange }) {
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
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Language selector */}
        <div style={{ position: 'relative' }}>
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

        {/* Contact */}
        <button onClick={() => setShowContact(true)}
          style={{ padding: '6px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 100, fontSize: 13, fontFamily: 'Nunito, sans-serif', fontWeight: 700, color: 'var(--text)' }}
        >
          <span>✉️ </span><span>{T.contact.title}</span>
        </button>
      </div>

      {/* Logo */}
      <div style={{ animation: 'fadeSlideUp 0.5s ease both' }}>
        <img src="/Zai/logo.png" alt="Zai" style={{ width: 160, height: 160, objectFit: 'contain' }} />
      </div>

      {/* Tagline */}
      <div style={{ animation: 'fadeSlideUp 0.5s 0.1s ease both', textAlign: 'center', marginTop: 8 }}>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 260 }}>{T.tagline}</p>
      </div>

      {/* Pills */}
      <div style={{ animation: 'fadeSlideUp 0.5s 0.2s ease both', display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
        {T.pills.map((f, i) => (
          <span key={i} style={{ padding: '6px 14px', background: 'var(--green-light)', color: 'var(--green-dark)', borderRadius: 100, fontSize: 13, fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}>{f}</span>
        ))}
      </div>

      {/* Scan CTA */}
      <div style={{ animation: 'fadeSlideUp 0.5s 0.3s ease both', marginTop: 48, width: '100%' }}>
        <button onClick={onScan} style={{ width: '100%', padding: '16px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-lg)', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 17, boxShadow: '0 6px 20px rgba(45,80,22,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <ScanIcon /><span>{T.scan}</span>
        </button>
      </div>

      {/* Share button */}
      <div style={{ animation: 'fadeSlideUp 0.5s 0.35s ease both', marginTop: 12, width: '100%' }}>
        <button onClick={handleShare} style={{ width: '100%', padding: '14px', background: 'transparent', color: 'var(--green-dark)', borderRadius: 'var(--radius-lg)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, border: '1.5px solid var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span>📤 </span><span>{shareLabel}</span>
        </button>
      </div>

      {/* Footer */}
      <div style={{ animation: 'fadeSlideUp 0.5s 0.4s ease both', marginTop: 20, textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{T.powered}</p>
        <button
          onClick={() => setShowPrivacy(true)}
          style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 6, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
        >
          {P.link || 'Privacy Policy'}
        </button>
      </div>

      {/* Contact modal */}
      {showContact && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowContact(false)}>
          <div style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', width: '100%', padding: '28px 24px 48px', animation: 'slideUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 20, marginBottom: 20 }}>
              <span>✉️ </span><span>{T.contact.title}</span>
            </h3>
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '16px 18px', marginBottom: 16 }}>
              <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{T.contact.name}</p>
              <a href={'mailto:' + T.contact.email} style={{ fontSize: 14, color: 'var(--green-dark)', textDecoration: 'none', fontWeight: 600 }}>{T.contact.email}</a>
            </div>
            <button onClick={() => setShowContact(false)} style={{ width: '100%', padding: '14px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15 }}>
              {T.contact.close}
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy modal */}
      {showPrivacy && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowPrivacy(false)}>
          <div style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
            </div>
            <div style={{ padding: '8px 24px 0', flexShrink: 0 }}>
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 20 }}>
                {P.title || 'Privacy Policy'}
              </h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                {P.updated || 'Last updated: May 2026'}
              </p>
            </div>
            {/* Scrollable content */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 24px 8px' }}>
              <Section title={P.collectTitle || 'What we collect'}>
                {P.collectBody || 'Nothing. Zai stores your scan history and saved products locally on your device only. This data never leaves your phone and is never sent to any server.'}
              </Section>
              <Section title={P.notCollectTitle || 'What we do NOT collect'}>
                {P.notCollectBody || 'No personal information. No name, email, location, device ID, analytics or advertising data of any kind.'}
              </Section>
              <Section title={P.cameraTitle || 'Camera'}>
                {P.cameraBody || 'Zai requests camera access solely to scan product barcodes. Camera data is processed entirely on your device and never transmitted anywhere.'}
              </Section>
              <Section title={P.thirdPartyTitle || 'Third-party services'}>
                {P.thirdPartyBody || 'When you scan or search a product, Zai queries the Open Food Facts and Open Beauty Facts APIs. These are free, open-source, non-profit databases. Their servers may log standard request data such as IP address and barcode queried as part of normal web server operation. Zai has no control over this logging.'}
              </Section>
              <Section title={P.yourDataTitle || 'Your data'}>
                {P.yourDataBody || 'All scan history and favourites are stored only on your device. You can delete this at any time using the Clear History function inside the app, or by clearing your browser data.'}
              </Section>
              <Section title={P.contactTitle || 'Contact'}>
                <span>{P.contactBody || 'For any privacy-related questions: '}</span>
                <a href="mailto:pedro.esteves.pt@proton.me" style={{ color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'none' }}>pedro.esteves.pt@proton.me</a>
              </Section>
            </div>
            <div style={{ padding: '12px 24px 40px', flexShrink: 0 }}>
              <button onClick={() => setShowPrivacy(false)} style={{ width: '100%', padding: '14px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15 }}>
                {P.close || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

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
