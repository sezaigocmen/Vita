/**
 * Figma: Component/1/Footer – ortada yukarı taşan yuvarlak "Home" butonu olan alt menü.
 * Sıra: AI · Discover · Home · Progress · Profile
 */
import { motion } from 'motion/react'
import type { NavApi } from '../../shell/navigation'
import aiIcon from '../../assets/icons/tab-ai.svg'
import aiActive from '../../assets/icons/tab-ai-active.svg'
import discoverIcon from '../../assets/icons/tab-discover.svg'
import discoverActive from '../../assets/icons/tab-discover-active.svg'
import homeIcon from '../../assets/icons/tab-home.svg'
import homeActive from '../../assets/icons/tab-home-active.svg'
import progressIcon from '../../assets/icons/tab-progress.svg'
import progressActive from '../../assets/icons/tab-progress-active.svg'
import profileIcon from '../../assets/icons/tab-profile.svg'
import profileActive from '../../assets/icons/tab-profile-active.svg'

const TABS = [
  { id: 'ai', label: 'AI Coach', icon: aiIcon, active: aiActive, size: [20, 18] },
  { id: 'discover', label: 'Discover', icon: discoverIcon, active: discoverActive, size: [24, 24] },
  { id: 'home', label: 'Home', icon: homeIcon, active: homeActive, size: [27, 27] },
  { id: 'progress', label: 'Progress', icon: progressIcon, active: progressActive, size: [20, 20] },
  { id: 'profile', label: 'Profile', icon: profileIcon, active: profileActive, size: [23, 23] },
] as const

/** Sayfa içeriğinin alt menünün arkasında kalmaması için bırakılacak boşluk */
export const TAB_BAR_SPACE = 'calc(78px + var(--safe-bottom))'

/** Alt menünün gizlendiği ekranlar (ör. sohbet ekranında yazı alanı en altta) */
const HIDDEN_ON = new Set(['ai-chat'])

export function TabBar({ nav, route }: { nav: NavApi; route: string }) {
  const hidden = HIDDEN_ON.has(route)
  return (
    <motion.nav
      className="absolute inset-x-0 bottom-0 z-[200]"
      style={{ filter: 'drop-shadow(0 -1px 2px rgb(0 0 0 / 0.06))', pointerEvents: hidden ? 'none' : 'auto' }}
      initial={false}
      animate={{ y: hidden ? '110%' : '0%' }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Ortadaki tümsek */}
      <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 rounded-full bg-bg" />
      <div className="relative mt-[22px] flex h-12 items-center justify-around bg-bg px-2" style={{ boxSizing: 'content-box', paddingBottom: 'max(var(--safe-bottom), 8px)' }}>
        {TABS.map((t) => {
          const selected = nav.tab === t.id
          const isHome = t.id === 'home'
          return (
            <button
              key={t.id}
              aria-label={t.label}
              aria-current={selected ? 'page' : undefined}
              onClick={() => nav.setTab(t.id)}
              className={`pressable relative flex items-center justify-center ${isHome ? 'h-16 w-16 -translate-y-[14px]' : 'h-12 w-12'}`}
            >
              <img src={selected ? t.active : t.icon} alt="" style={{ width: t.size[0], height: t.size[1] }} />
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}
