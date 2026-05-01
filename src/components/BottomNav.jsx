import React from 'react'
import { t } from '../lib/i18n'

const TABS = [
  { id: 'home', icon: HomeIcon },
  { id: 'search', icon: SearchIcon },
  { id: 'scan', icon: ScanIcon, center: true },
  { id: 'favorites', icon: StarIcon },
  { id: 'history', icon: HistoryIcon },
]

export default function BottomNav({ active, onChange, lang }) {
  const T = t(lang)
  return (
    <nav style={{ height: 'var(--nav-height)', paddingBottom: 'var(--safe-bottom)', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexShrink: 0, position: 'relative', zIndex: 50 }}>
      {TABS.map(tab => {
        const Icon = tab.icon
        const isActive = active === tab.id
        const label = tab.id === 'home' ? T.nav.home
          : tab.id === 'search' ? T.nav.search
          : tab.id === 'history' ? T.nav.history
          : tab.id === 'favorites' ? (T.nav.favorites || 'Saved')
          : ''
        return (
          <button key={tab.id} onClick={() => onChange(tab.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, flex: 1, height: '100%', color: isActive ? 'var(--green-dark)' : 'var(--text-light)', transition: 'color 0.2s ease' }}>
            {tab.center ? (
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--green-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(45,80,22,0.35)', marginTop: -8 }}
                onTouchStart={e => e.currentTarget.style.transform = 'scale(0.92)'}
                onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Icon size={22} color="#fff" />
              </div>
            ) : (
              <>
                <Icon size={20} color={isActive ? 'var(--green-dark)' : 'var(--text-light)'} />
                <span style={{ fontSize: 9, fontFamily: 'Nunito, sans-serif', fontWeight: isActive ? 700 : 400, letterSpacing: '0.02em' }}>{label}</span>
              </>
            )}
          </button>
        )
      })}
    </nav>
  )
}

function HomeIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
function SearchIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}
function ScanIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>
}
function StarIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}
function HistoryIcon({ size, color }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4.5"/><polyline points="3 3 3 7 7 7"/></svg>
}
