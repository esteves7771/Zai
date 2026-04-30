import React, { useState } from 'react'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Search from './pages/Search'
import History from './pages/History'
import { getLang, setLang } from './lib/i18n'

export default function App() {
  const [tab, setTab] = useState('home')
  const [lang, setLangState] = useState(getLang())

  const changeLang = (code) => {
    setLang(code)
    setLangState(code)
  }

  const goToScan = () => setTab('scan')

  const renderPage = () => {
    switch (tab) {
      case 'home':    return <Home key="home" onScan={goToScan} lang={lang} onLangChange={changeLang} />
      case 'scan':    return <Scan key="scan" lang={lang} />
      case 'search':  return <Search key="search" lang={lang} />
      case 'history': return <History key="history" lang={lang} />
      default:        return <Home key="home" onScan={goToScan} lang={lang} onLangChange={changeLang} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderPage()}
      </main>
      <BottomNav active={tab} onChange={setTab} lang={lang} />
    </div>
  )
}
