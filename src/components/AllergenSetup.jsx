import React, { useState } from 'react'
import { ALLERGEN_LIST, getAllergens, setAllergens, markAllergenSetupSeen } from '../lib/allergens'

export default function AllergenSetup({ onDone }) {
  const [selected, setSelected] = useState(getAllergens())

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const save = () => {
    setAllergens(selected)
    markAllergenSetupSeen()
    onDone()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>
        <div style={{ padding: '8px 24px 16px', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 20, marginBottom: 6 }}>
            🚨 Set Your Allergens
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Select your allergens and Zai will warn you instantly when a scanned product contains them.
          </p>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '0 24px 8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {ALLERGEN_LIST.map(a => {
              const active = selected.includes(a.id)
              return (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: active ? '2px solid var(--score-red)' : '2px solid var(--border)',
                    background: active ? '#fdecea' : 'var(--surface-2)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    textAlign: 'left', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{a.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? 'var(--score-red)' : 'var(--text)', fontFamily: 'Nunito, sans-serif' }}>{a.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ padding: '16px 24px 40px', flexShrink: 0, display: 'flex', gap: 12 }}>
          <button onClick={save} style={{ flex: 1, padding: '14px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15 }}>
            Save {selected.length > 0 ? `(${selected.length})` : ''}
          </button>
          <button onClick={() => { markAllergenSetupSeen(); onDone() }} style={{ padding: '14px 20px', background: 'var(--surface-2)', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15 }}>
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
