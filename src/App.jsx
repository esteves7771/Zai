import React, { useState } from 'react'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Search from './pages/Search'
import History from './pages/History'

export default function App() {
  const [tab, setTab] = useState('home')

  const goToScan = () => setTab('scan')

  const renderPage = () => {
    switch (tab) {
      case 'home':    return <Home key="home" onScan={goToScan} />
      case 'scan':    return <Scan key="scan" />
      case 'search':  return <Search key="search" />
      case 'history': return <History key="history" />
      default:        return <Home key="home" onScan={goToScan} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderPage()}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
