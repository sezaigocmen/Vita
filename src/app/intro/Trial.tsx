/** Figma: Introduction-5 – "How does your free trial work?" (demo: gerçek ödeme yok) */
import { motion } from 'motion/react'
import { useState } from 'react'
import { useNav } from '../../shell/navigation'
import { PrimaryButton } from '../components/PrimaryButton'
import { openDemoNotice } from '../components/DemoNotice'
import iconClose from '../../assets/intro/icon-close.svg'
import iconUnlock from '../../assets/intro/icon-unlock.svg'
import iconBell from '../../assets/intro/icon-bell.svg'
import iconStar from '../../assets/intro/icon-star.svg'

/** Bugünden itibaren n gün sonrası, ör. "November 21" */
function dayFromNow(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

const STEPS = [
  { icon: iconUnlock, title: 'Today: Unlimited access', text: '', active: true },
  { icon: iconBell, title: 'Day 2: Trial Reminder', text: 'Receive a reminder about when your free trial will end.' },
  { icon: iconStar, title: 'Day 3: Your Trial Ends Tomorrow', text: `Your subscription will start on ${dayFromNow(3)}.` },
]

type Plan = 'weekly' | 'lifetime'

export function Trial() {
  const nav = useNav()
  const [plan, setPlan] = useState<Plan>('weekly')
  const start = () => nav.push('onboarding')

  return (
    <div
      className="flex h-full flex-col bg-bg px-6"
      style={{ paddingTop: 'calc(var(--safe-top) + 2px)', paddingBottom: 'calc(max(var(--safe-bottom), 12px) + 4px)' }}
    >
      {/* Üst bar */}
      <div className="flex h-6 items-center justify-between">
        <button aria-label="Close" onClick={start} className="pressable -m-2 p-2">
          <img src={iconClose} alt="" className="h-6 w-6" />
        </button>
        <button onClick={() => openDemoNotice(nav, 'Restore purchases')} className="pressable -my-2 py-2 text-[13px] font-light text-ink">
          Restore
        </button>
      </div>

      <h1 className="mx-auto mt-[29px] max-w-[325px] text-center text-title1 font-semibold text-ink">How does your free trial work?</h1>

      {/* Zaman çizelgesi */}
      <ol className="mt-[33px] flex flex-col">
        {STEPS.map((s, i) => (
          <motion.li
            key={s.title}
            className="flex gap-[21px]"
            style={{ minHeight: [93, 124][i] }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex w-[45px] shrink-0 flex-col items-center">
              <span className={`flex h-[45px] w-[45px] items-center justify-center rounded-full ${s.active ? 'bg-brand' : 'bg-[#D4E8E4]'}`}>
                <img src={s.icon} alt="" className="h-8 w-8" />
              </span>
              {i < STEPS.length - 1 && <span className={`w-[3px] flex-1 ${s.active ? 'bg-[linear-gradient(#0BB791_50%,#D4E8E4_50%)]' : 'bg-[#D4E8E4]'}`} />}
            </div>
            <div className={`flex flex-col gap-[7px] pt-[11px] ${i < STEPS.length - 1 ? 'pb-[36px]' : ''}`}>
              <p className={`text-title3 font-semibold ${s.active ? 'text-brand' : 'text-ink'}`}>{s.title}</p>
              {s.text && <p className="max-w-[243px] text-[15px] leading-[18px] text-black/50">{s.text}</p>}
            </div>
          </motion.li>
        ))}
      </ol>

      <div className="min-h-4 flex-1" />

      {/* Plan seçimi */}
      <div className="flex flex-col gap-[10px]">
        <PlanOption selected={plan === 'weekly'} onSelect={() => setPlan('weekly')} label="7-day free trial" price="$6.99/week, cancel anytime" />
        <PlanOption selected={plan === 'lifetime'} onSelect={() => setPlan('lifetime')} label="Pay once" price="$149.99 lifetime" badge="Save 59%" />
      </div>

      <PrimaryButton size="lg" className="mt-[10px]" onClick={start}>
        {plan === 'weekly' ? '7-day free trial' : 'Continue'}
      </PrimaryButton>

      <div className="mt-[14px] flex justify-between text-[13px] font-light text-ink">
        <button onClick={() => openDemoNotice(nav, 'Terms of Use')} className="pressable -my-2 py-2">
          Terms
        </button>
        <button onClick={() => openDemoNotice(nav, 'Privacy Policy')} className="pressable -my-2 py-2">
          Privacy
        </button>
      </div>
    </div>
  )
}

function PlanOption({ selected, onSelect, label, price, badge }: { selected: boolean; onSelect: () => void; label: string; price: string; badge?: string }) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className={`pressable relative flex h-[55px] w-full flex-col items-start justify-center rounded-[19px] border px-[19px] text-left transition-colors ${
        selected ? 'border-brand/60 bg-mint/35' : 'border-black/60 bg-transparent'
      }`}
    >
      <span className="text-caption text-black/60">{label}</span>
      <span className="text-[15px] leading-[18px] text-ink">{price}</span>
      {badge && <span className="absolute right-[19px] top-1/2 -translate-y-1/2 rounded-[6px] bg-brand px-[9px] py-[2px] text-caption text-white">{badge}</span>}
    </button>
  )
}
