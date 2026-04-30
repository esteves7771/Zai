import React, { useEffect, useRef, useState } from 'react'
import { fetchByBarcode } from '../lib/api'
import ProductSheet from '../components/ProductSheet'

const STATES = { idle: 'idle', scanning: 'scanning', loading: 'loading', result: 'result', notfound: 'notfound', error: 'error' }

export default function Scan() {
  const [state, setState] = useState(STATES.idle)
  const [product, setProduct] = useState(null)
  const [lastBarcode, setLastBarcode] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const animFrameRef = useRef(null)
  const cooldown = useRef(false)
  const canvasRef = useRef(document.createElement('canvas'))

  useEffect(() => {
    return () => stopScanner()
  }, [])

  const stopScanner = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  const startScanner = async () => {
    setState(STATES.scanning)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      scanLoop()
    } catch (err) {
      console.error(err)
      setState(STATES.error)
    }
  }

  const scanLoop = () => {
    if (!videoRef.current || !streamRef.current) return
    const video = videoRef.current
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      try {
        if ('BarcodeDetector' in window) {
          const detector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'] })
          detector.detect(canvas).then(barcodes => {
            if (barcodes.length > 0 && !cooldown.current) {
              onScanSuccess(barcodes[0].rawValue)
            }
          })
        }
      } catch {}
    }
    animFrameRef.current = requestAnimationFrame(scanLoop)
  }

  const onScanSuccess = async (barcode) => {
    if (cooldown.current) return
    cooldown.current = true
    setLastBarcode(barcode)
    stopScanner()
    setState(STATES.loading)
    try {
      const p = await fetchByBarcode(barcode)
      if (p) { setProduct(p); setState(STATES.result) }
      else setState(STATES.notfound)
    } catch { setState(STATES.error) }
    setTimeout(() => { cooldown.current = false }, 2000)
  }

  const reset = () => { setProduct(null); setLastBarcode(null); setState(STATES.idle) }
  const handleScanAgain = () => { reset(); setTimeout(startScanner, 400) }

  return (
    <div className="page-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#000', position: 'relative' }}>

      {/* Live camera video - always rendered when scanning */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          display: state === STATES.scanning ? 'block' : 'none',
        }}
      />

      {/* Scan overlay on top of video */}
      {state === STATES.scanning && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 260, height: 130 }}>
            {['tl','tr','bl','br'].map(c => (
              <div key={c} style={{
                position: 'absolute', width: 22, height: 22,
                borderColor: '#FFD43B', borderStyle: 'solid', borderWidth: 0,
                ...(c==='tl' ? { top:0, left:0, borderTopWidth:3, borderLeftWidth:3, borderRadius:'4px 0 0 0' } : {}),
                ...(c==='tr' ? { top:0, right:0, borderTopWidth:3, borderRightWidth:3, borderRadius:'0 4px 0 0' } : {}),
                ...(c==='bl' ? { bottom:0, left:0, borderBottomWidth:3, borderLeftWidth:3, borderRadius:'0 0 0 4px' } : {}),
                ...(c==='br' ? { bottom:0, right:0, borderBottomWidth:3, borderRightWidth:3, borderRadius:'0 0 4px 0' } : {}),
              }} />
            ))}
            <div style={{
              position: 'absolute', left: 8, right: 8, height: 2,
              background: 'linear-gradient(90deg, transparent, #FFD43B, transparent)',
              animation: 'scanLine 1.8s ease-in-out infinite', top: '50%',
            }} />
          </div>
          <style>{`@keyframes scanLine { 0% { top: 10px; } 50% { top: calc(100% - 10px); } 100% { top: 10px; } }`}</style>
          <div style={{
            position: 'absolute', bottom: 60, color: 'rgba(255,255,255,0.8)',
            fontSize: 13, background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: 100,
          }}>Align barcode within frame</div>
        </div>
      )}

      {/* Centered content for non-scanning states */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>

        {state === STATES.idle && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: 32, textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarcodeIcon size={48} />
            </div>
            <div>
              <p style={{ color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Ready to Scan</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Point your camera at a product barcode</p>
            </div>
            <button onClick={startScanner} style={{ padding: '16px 40px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-xl)', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 16, boxShadow: '0 6px 20px rgba(45,80,22,0.4)' }}>
              Start Camera
            </button>
          </div>
        )}

        {state === STATES.loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--yellow)', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#fff', fontSize: 15 }}>Looking up product…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

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
              <a href={`https://world.openfoodfacts.org/product/${lastBarcode}`} target="_blank" rel="noreferrer" style={{ padding: '14px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15, textAlign: 'center', textDecoration: 'none' }}>
                Contribute on Open Food Facts ↗
              </a>
            </div>
          </div>
        )}

        {state === STATES.error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: 32, textAlign: 'center' }}>
            <span style={{ fontSize: 56 }}>📷</span>
            <p style={{ color: '#fff', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 19 }}>Camera Error</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Please allow camera access and try again.</p>
            <button onClick={reset} style={{ padding: '14px 32px', background: 'var(--green-dark)', color: '#fff', borderRadius: 'var(--radius-md)', fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 15 }}>Try Again</button>
          </div>
        )}
      </div>

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
