import React, { useState, useRef, useEffect } from 'react'
import { searchProducts, fetchByBarcode } from '../lib/api'
import { scoreProduct } from '../lib/scoring'
import ProductCard from '../components/ProductCard'
import ProductSheet from '../components/ProductSheet'
import { t } from '../lib/i18n'

const RECENT_KEY = 'zai_recent_searches'
const MAX_RECENT = 5

function getRecentSearches() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}

function addRecentSearch(query) {
  if (!query.trim()) return
  const recent = getRecentSearches().filter(r => r !== query)
  localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...recent].slice(0, MAX_RECENT)))
}

function isBarcode(str) {
  return /^\d{8,14}$/.test(str.trim())
}

export default function Search({ lang = 'en' }) {
  const T = t(lang)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [focused, setFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState(getRecentSearches())
  const debounceRef = useRef(null)
  const inputRef = useRef(null)

  const handleSearch = async (q) => {
    if (!q.trim()) { setResults([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    addRecentSearch(q)
    setRecentSearches(getRecentSearches())

    try {
      // Barcode detection
      if (isBarcode(q)) {
        const product = await fetchByBarcode(q.trim())
        if (product) {
          setResults([product])
          setLoading(false)
          return
        }
      }
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
    inputRef.current?.blur()
  }

  const useRecent = (term) => {
    setQuery(term)
    setFocused(false)
    handleSearch(term)
  }

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY)
    setRecentSearches([])
  }

  const showRecent = focused && !query && recentSearches.length > 0

  return (
    <div className="page-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 22, marginBottom: 14 }}>{T.search.title}</h2>
        <form onSubmit={onSubmit}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <SearchIcon />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder={T.search.placeholder}
              value={query}
              onChange={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              style={{ width: '100%', padding: '13px 44px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 15, fontFamily: 'DM Sans, sans-serif', color: 'var(--text)', outline: 'none' }}
            />
            {query && (
              <button type="button" onClick={() => { setQuery(''); setResults([]); setSearched(false) }} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}>×</button>
            )}
          </div>
        </form>

        {/* Recent searches dropdown */}
        {showRecent && (
          <div style={{ marginTop: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px 4px' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent</span>
              <button onClick={clearRecent} style={{ fontSize: 11, color: 'var(--text-muted)' }}>Clear</button>
            </div>
            {recentSearches.map((term, i) => (
              <button key={i} onClick={() => useRecent(term)} style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', borderTop: i === 0 ? 'none' : '1px solid var(--border)', background: 'none' }}>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>🕐</span>
                <span style={{ fontSize: 14, color: 'var(--text)' }}>{term}</span>
              </button>
            ))}
          </div>
        )}
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
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{T.search.empty}</p>
            <p style={{ fontSize: 14 }}>{T.search.emptyHint}</p>
          </div>
        )}

        {!loading && !searched && !showRecent && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🔍</span>
            <p style={{ fontSize: 14, marginBottom: 8 }}>{T.search.hint}</p>
            <p style={{ fontSize: 12, color: 'var(--text-light)' }}>You can also type a barcode number directly</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{results.length} {T.search.results}</p>
            {results.map((p, i) => {
              const score = scoreProduct(p)
              return (
                <ProductCard key={p.barcode || i} product={p} score={score} onClick={() => setSelectedProduct(p)} />
              )
            })}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductSheet product={selectedProduct} onClose={() => setSelectedProduct(null)} lang={lang} />
      )}
    </div>
  )
}

function SearchIcon() {
  return <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}

function Spinner() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--green-dark)', animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
