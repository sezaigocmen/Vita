import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppShell } from './shell/AppShell'
import type { ShowcaseMeta } from './shell/InfoPanel'
import { App } from './app/App'
import { resetDemo } from './app/store'
import logo from './assets/icons/logo.svg'

/** Masaüstü tanıtım paneli bilgileri (her projede burası değişir) */
const meta: ShowcaseMeta = {
  name: 'Vita',
  tagline: 'Wellness app with a personal AI coach',
  description: 'Fitness, nutrition and mindfulness in one calm app. Swipeable daily cards, guided workouts and recipes, progress insights and an AI coach that adapts to you.',
  logo,
  accent: '#0BB791',
  pageBackground: 'radial-gradient(900px 600px at 15% 15%, #DCEDE8 0%, transparent 60%), radial-gradient(700px 500px at 90% 90%, #F7E6D8 0%, transparent 60%), #F3F7F5',
  designer: 'Sezai Göçmen',
  links: [
    { label: 'Full case study', href: 'https://www.sezaigocmen.com/projects/vita' },
  ],
  onReset: resetDemo,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppShell meta={meta}>
      <App />
    </AppShell>
  </StrictMode>,
)
