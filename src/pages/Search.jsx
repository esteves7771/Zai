import React, { useState, useRef } from 'react'
import { searchProducts } from '../lib/api'
import { scoreProduct } from '../lib/scoring'
import ProductCard from '../components/ProductCard'
import ProductSheet from '../components/ProductSheet'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const debounceRef = useRef(null)

  const handleSearch = async (q) => {
    if (!q.trim()) { setResults([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    try {
      const data = await searchProducts(q)
      setResults(data)
    } catch {
      setResults([])
    }
    setLoading(false)
  }

  const onChange = (e) => {
    const v = e.target.value
    setQuery(v)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => handleSearch(v), 500)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    clearTimeout(debounceRef.current)
    handleSearch(query)
  }

  return (
    <div className="page-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 22, marginBottom: 14 }}>Search</h2>
        <form onSubmit={onSubmit}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search products, brands…"
              value={query}
              onChange={onChange}
              autoFocus
              style={{
                width: '100%',
                padding: '13px 44px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: 15,
                fontFamily: 'DM Sans, sans-serif',
                color: 'var(--text)',
                outline: 'none',
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setResults([]); setSearched(false) }}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}
              >×</button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 20px' }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spinner />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🤷</span>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>No results found</p>
            <p style={{ fontSize: 14 }}>Try a different product name or brand.</p>
          </div>
        )}

        {!loading && !searched && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🔍</span>
            <p style={{ fontSize: 14 }}>Search any food product by name or brand.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{results.length} results</p>
            {results.map((p, i) => {
              const score = scoreProduct(p)
              return (
                <ProductCard
                  key={p.barcode || i}
                  product={p}
                  score={score}
                  onClick={() => setSelectedProduct(p)}
                />
              )
            })}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductSheet product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function Spinner() {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      border: '3px solid var(--border)',
      borderTopColor: 'var(--green-dark)',
      animation: 'spin 0.8s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
