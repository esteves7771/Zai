import React, { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { fetchByBarcode } from '../lib/api'
import ProductSheet from '../components/ProductSheet'

const STATES = { idle: 'idle', scanning: 'scanning', loading: 'loading', result: 'result', notfound: 'notfound', error: 'error' }

export default function Scan() {
  const [state, setState] = useState(STATES.idle)
  const [product, setProduct] = useState(null)
  const [lastBarcode, setLastBarcode] = useState(null)
  const scannerRef = useRef(null)
  const html5QrRef = useRef(null)
  const cooldown = useRef(false)

  useEffect(() => {
    return () => stopScanner()
  }, [])

  const startScanner = async () => {
  setState(STATES.scanning)
  try {
    const scanner = new Html5Qrcode('qr-reader')
    html5QrRef.current = scanner
    await scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 120 } },
      onScanSuccess,
      () => {}
    )
    // Force video to be visible
    setTimeout(() => {
      const video = document.querySelector('#qr-reader video')
      if (video) {
        video.style.width = '100%'
        video.style.height = '100%'
        video.style.objectFit = 'cover'
        video.style.position = 'absolute'
        video.style.top = '0'
        video.style.left = '0'
      }
      const qrDiv = document.querySelector('#qr-reader')
      if (qrDiv) {
        qrDiv.style.overflow = 'hidden'
      }
    }, 500)
  } catch (err) {
    console.error(err)
    setState(STATES.error)
  }
}

  const stopScanner = async () => {
    try {
      if (html5QrRef.current?.isScanning) {
        await html5QrRef.current.stop()
        html5QrRef.current.clear()
      }
    } catch {}
  }

  const onScanSuccess = async (barcode) => {
    if (cooldown.current) return
    cooldown.current = true
    setLastBarcode(barcode)
    await stopScanner()
    setState(STATES.loading)
    try {
      const p = await fetchByBarcode(barcode)
      if (p) {
        setProduct(p)
        setState(STATES.result)
      } else {
        setState(STATES.notfound)
      }
    } catch {
      setState(STATES.error)
    }
    setTimeout(() => { cooldown.current = false }, 2000)
  }

  const reset = () => {
    setProduct(null)
    setLastBarcode(null)
    setState(STATES.idle)
  }

  const handleScanAgain = () => {
    reset()
    setTimeout(startScanner, 400)
  }

  return (
    <div className="page-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#000' }}>

      {/* Camera area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* QR reader container (always in DOM when scanning) */}
        <div
          id="qr-reader"
          style={{
            position: 'absolute', inset: 0,
            display: state === STATES.scanning ? 'block' : 'none',
          }}
        />

        {/* Idle state */}
        {state === STATES.idle && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 24, padding: 32, textAlign: 'center',
          }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarcodeIcon size={48} />
            </div>
            <div>
              <p style={{ color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                Ready to Scan
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                Point your camera at a product barcode
              </p>
            </div>
            <button
              onClick={startScanner}
              style={{
                padding: '16px 40px',
                background: 'var(--green-dark)',
                color: '#fff',
                borderRadius: 'var(--radius-xl)',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: 800, fontSize: 16,
                boxShadow: '0 6px 20px rgba(45,80,22,0.4)',
              }}
            >Start Camera</button>
          </div>
        )}

        {/* Scan overlay */}
        {state === STATES.scanning && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Corners */}
            <div style={{ position: 'relative', width: 260, height: 130 }}>
              {['tl','tr','bl','br'].map(c => (
                <div key={c} style={{
                  position: 'absolute',
                  width: 22, height: 22,
                  borderColor: '#FFD43B',
                  borderStyle: 'solid',
                  borderWidth: 0,
                  ...(c === 'tl' ? { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderRadius: '4px 0 0 0' } : {}),
                  ...(c === 'tr' ? { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderRadius: '0 4px 0 0' } : {}),
                  ...(c === 'bl' ? { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderRadius: '0 0 0 4px' } : {}),
                  ...(c === 'br' ? { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderRadius: '0 0 4px 0' } : {}),
                }} />
              ))}
              {/* Scan line */}
              <div style={{
                position: 'absolute', left: 8, right: 8, height: 2,
                background: 'linear-gradient(90deg, transparent, #FFD43B, transparent)',
                animation: 'scanLine 1.8s ease-in-out infinite',
                top: '50%',
              }} />
            </div>
            <style>{`
              @keyframes scanLine {
                0% { top: 10px; }
                50% { top: calc(100% - 10px); }
                100% { top: 10px; }
              }
            `}</style>
            {/* Hint */}
            <div style={{
              position: 'absolute', bottom: 60,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 13, textAlign: 'center',
              background: 'rgba(0,0,0,0.5)',
              padding: '8px 16px', borderRadius: 100,
            }}>Align barcode within frame</div>
          </div>
        )}

        {/* Loading */}
        {state === STATES.loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--yellow)', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#fff', fontSize: 15 }}>Looking up product…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Not found */}
        {state === STATES.notfound && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 32, textAlign: 'center' }}>
            <span style={{ fontSize: 56 }}>🔍</span>
            <div>
              <p style={{ color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 19, marginBottom: 8 }}>Product Not Found</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 4 }}>Barcode: {lastBarcode}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>This product isn't in our database yet.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              <button onClick={handleScanAgain} style={{ padding: '14px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15 }}>Scan Again</button>
              <a
                href={`https://world.openfoodfacts.org/product/${lastBarcode}`}
                target="_blank" rel="noreferrer"
                style={{ padding: '14px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, textAlign: 'center', textDecoration: 'none' }}
              >Contribute on Open Food Facts ↗</a>
            </div>
          </div>
        )}

        {/* Error */}
        {state === STATES.error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 32, textAlign: 'center' }}>
            <span style={{ fontSize: 56 }}>📷</span>
            <p style={{ color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 19 }}>Camera Error</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Please allow camera access and try again.</p>
            <button onClick={reset} style={{ padding: '14px 32px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15 }}>Try Again</button>
          </div>
        )}
      </div>

      {/* Product sheet */}
      {state === STATES.result && product && (
        <ProductSheet product={product} onClose={reset} onScanAgain={handleScanAgain} />
      )}
    </div>
  )
}

function BarcodeIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
      <line x1="7" y1="12" x2="17" y2="12"/>
    </svg>
  )
}
