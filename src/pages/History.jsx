import React, { useState, useEffect } from 'react'
import { getHistory, clearHistory } from '../lib/history'
import { scoreProduct } from '../lib/scoring'
import ProductCard from '../components/ProductCard'
import ProductSheet from '../components/ProductSheet'
import { t } from '../lib/i18n'

export default function History({ lang = 'en' }) {
  const T = t(lang)
  const [history, setHistory] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleClear = () => {
    clearHistory()
    setHistory([])
    setShowConfirm(false)
  }

  const historyToProduct = (entry) => ({
    barcode: entry.barcode,
    name: entry.name,
    brand: entry.brand,
    image: entry.image,
    nutriscoreGrade: entry.nutriscoreGrade,
    additivesTags: entry.additivesTags || [],
    nutriments: entry.nutriments || {},
    labels: entry.labels || [],
    ingredients: entry.ingredients || null,
    quantity: entry.quantity || '',
    productType: entry.productType || 'food',
    novaGroup: entry.novaGroup || null,
    ecoscoreGrade: entry.ecoscoreGrade || null,
    allergensTags: entry.allergensTags || [],
  })

  // Recalculate score live instead of using stored value
  const getLiveScore = (entry) => {
    const product = historyToProduct(entry)
    return scoreProduct(product)
  }

  return (
    <div className="page-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 22 }}>{T.history.title}</h2>
        {history.length > 0 && (
          <button onClick={() => setShowConfirm(true)} style={{ fontSize: 13, color: 'var(--score-red)', fontWeight: 600 }}>
            {T.history.clearAll}
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 20px' }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 56, display: 'block', marginBottom: 20 }}>📋</span>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{T.history.empty}</p>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{T.history.emptyHint}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
              {history.length} {history.length !== 1 ? T.history.scannedPlural : T.history.scanned}
            </p>
            {history.map(entry => {
              const liveScore = getLiveScore(entry)
              return (
                <ProductCard
                  key={entry.id}
                  product={{ name: entry.name, brand: entry.brand, image: entry.image, nutriscoreGrade: entry.nutriscoreGrade }}
                  score={liveScore}
                  scannedAt={entry.scannedAt}
                  onClick={() => setSelectedProduct(entry)}
                />
              )
            })}
          </div>
        )}
      </div>

      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowConfirm(false)}>
          <div style={{ background: 'var(--surface)', borderRadius: '24px 24px 0 0', width: '100%', padding: '24px 24px 40px', animation: 'slideUp 0.3s ease' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 19, marginBottom: 10 }}>{T.history.confirmTitle}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>{T.history.confirmText}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: 14, background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{T.history.cancel}</button>
              <button onClick={handleClear} style={{ flex: 1, padding: 14, background: 'var(--score-red)', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>{T.history.clear}</button>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductSheet
          product={historyToProduct(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          lang={lang}
        />
      )}
    </div>
  )
}
