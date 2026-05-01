import React, { useState, useEffect } from 'react'
import { getFavorites, removeFavorite } from '../lib/favorites'
import ProductCard from '../components/ProductCard'
import ProductSheet from '../components/ProductSheet'
import { t } from '../lib/i18n'

export default function Favorites({ lang = 'en' }) {
  const T = t(lang)
  const [favorites, setFavorites] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

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
  })

  const handleClose = () => {
    setSelectedProduct(null)
    setFavorites(getFavorites())
  }

  return (
    <div className="page-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 22 }}>
          {T.favorites?.title || 'Saved'}
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 20px' }}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 56, display: 'block', marginBottom: 20 }}>⭐</span>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>
              {T.favorites?.empty || 'No saved products yet'}
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>
              {T.favorites?.emptyHint || 'Tap the star on any product to save it here.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
              {favorites.length} {favorites.length !== 1 ? (T.favorites?.savedPlural || 'products saved') : (T.favorites?.saved || 'product saved')}
            </p>
            {favorites.map(entry => (
              <ProductCard
                key={entry.id}
                product={{ name: entry.name, brand: entry.brand, image: entry.image, nutriscoreGrade: entry.nutriscoreGrade }}
                score={entry.score}
                onClick={() => setSelectedProduct(entry)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductSheet
          product={historyToProduct(selectedProduct)}
          onClose={handleClose}
          lang={lang}
        />
      )}
    </div>
  )
}
