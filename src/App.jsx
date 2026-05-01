import React, { useState } from 'react'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Search from './pages/Search'
import History from './pages/History'
import Favorites from './pages/Favorites'
import OnboardingScreen from './components/OnboardingScreen'
import AllergenSetup from './components/AllergenSetup'
import { getLang, setLang } from './lib/i18n'
import { hasSeenAllergenSetup } from './lib/allergens'

const ONBOARDING_KEY = 'zai_onboarding_done'

export default function App() {
  const [tab, setTab] = useState('home')
  const [lang, setLangState] = useState(getLang())
  const [showOnboarding, setShowOnboarding] = useState(() => localStorage.getItem(ONBOARDING_KEY) !== 'true')
  const [showAllergenSetup, setShowAllergenSetup] = useState(false)

  const changeLang = (code) => { setLang(code); setLangState(code) }
  const goToScan = () => setTab('scan')

  const handleOnboardingDone = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setShowOnboarding(false)
    if (!hasSeenAllergenSetup()) setShowAllergenSetup(true)
  }

  const renderPage = () => {
    switch (tab) {
      case 'home':      return <Home key="home" onScan={goToScan} lang={lang} onLangChange={changeLang} onOpenAllergens={() => setShowAllergenSetup(true)} />
      case 'scan':      return <Scan key="scan" lang={lang} />
      case 'search':    return <Search key="search" lang={lang} />
      case 'history':   return <History key="history" lang={lang} />
      case 'favorites': return <Favorites key="favorites" lang={lang} />
      default:          return <Home key="home" onScan={goToScan} lang={lang} onLangChange={changeLang} onOpenAllergens={() => setShowAllergenSetup(true)} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderPage()}
      </main>
      <BottomNav active={tab} onChange={setTab} lang={lang} />
      {showOnboarding && <OnboardingScreen onDone={handleOnboardingDone} />}
      {showAllergenSetup && <AllergenSetup onDone={() => setShowAllergenSetup(false)} />}
    </div>
  )
}
