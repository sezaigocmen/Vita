/** Figma: Home Page-1 / -2 / -3 – günlük özet, kartlar, rozetler, meydan okumalar, Quick Tip */
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { MealSheet, SleepSheet } from './QuickLogSheets'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { Header } from '../components/Header'
import { TAB_BAR_SPACE } from '../components/TabBar'
import { CardButton, CardProgress, DailyCard, ProgressBar, SectionTitle, SmallCard } from '../components/Cards'
import { useDayLog, useVita } from '../store'
import { dateKey,fmtLitres, fmtSleep, GLASS_ML, progressOf, startOfToday, TARGETS } from '../data/daily'
import { ACHIEVEMENTS, AI_SUGGESTION, CHALLENGES, QUOTES, TIPS } from '../data/home'
import { DayStrip } from './DayStrip'
import imgWalk from '../../assets/home/img-walk.svg'
import imgWater from '../../assets/home/img-water.svg'
import imgSleep from '../../assets/home/img-sleep.svg'
import imgFood from '../../assets/home/img-food.svg'
import iconAi from '../../assets/home/icon-ai.svg'
import iconRefresh from '../../assets/home/icon-refresh.png'
import tipArrow from '../../assets/home/tip-arrow.png'

const soon = (what: string) => toast(`${what} — coming soon in this demo`)

export function HomeScreen() {
  const nav = useNav()
  const today = useMemo(startOfToday, [])
  const todayKey = dateKey(today)
  const [selected, setSelected] = useState(todayKey)
  const isToday = selected === todayKey
  const log = useDayLog(selected)
  const p = progressOf(log)

  const goal = useVita((s) => s.answers.goal?.[0] ?? 'fitter')
  const addGlasses = useVita((s) => s.addGlasses)
  const claimed = useVita((s) => s.claimed)
  const accepted = useVita((s) => s.accepted)
  const toggleClaim = useVita((s) => s.toggleClaim)
  const toggleAccept = useVita((s) => s.toggleAccept)

  const [quote, setQuote] = useState(0)
  const [spin, setSpin] = useState(0)
  const [tip, setTip] = useState<number | null>(null)

  const selDate = new Date(selected + 'T00:00:00')
  const dayLabel = isToday ? `Today ${selDate.getDate()}` : selDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })
  const month = selDate.toLocaleDateString('en-US', { month: 'long' })

  const drink = () => {
    addGlasses(todayKey, 1)
    toast(`+${GLASS_ML} ml water 💧`)
  }

  /* Yürüyüş: Start → canlı mesafe sayacı (demo için hızlandırılmış: 2 sn'de 0,1 km), Stop → kaydet */
  const walkActive = useVita((s) => s.walkActive)
  const setWalkActive = useVita((s) => s.setWalkActive)
  const updateLog = useVita((s) => s.updateLog)
  useEffect(() => {
    if (!walkActive) return
    const t = setInterval(() => updateLog(todayKey, (c) => ({ walkKm: Math.min(42, Math.round((c.walkKm + 0.1) * 10) / 10) })), 2000)
    return () => clearInterval(t)
  }, [walkActive, todayKey, updateLog])
  const toggleWalk = () => {
    if (walkActive) {
      setWalkActive(false)
      toast(`🚶 Walk saved · ${log.walkKm} km today`)
    } else {
      setWalkActive(true)
      toast('🚶 Walk started — keep moving!')
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-header">
      <Header title="Vita" />

      <main className="scroll-y relative min-h-0 flex-1">
        {/* Günün sözü + Quick Tip */}
        <section className="relative px-6 pb-[13px] pt-[17px]">
          <div className="min-h-[54px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={quote}
                className="text-[15px] italic leading-[18px] text-ink"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                “{QUOTES[quote]}”
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="mt-[8px] flex items-center gap-[12px]">
            <button
              onClick={() => setTip(tip === null ? Math.floor(Math.random() * TIPS.length) : null)}
              className="pressable relative z-30 h-[24px] rounded-chip bg-mint px-[10px] text-[12px] font-medium text-white shadow-btn"
            >
              Get Quick Tip
            </button>
            <button
              onClick={() => {
                setQuote((quote + 1) % QUOTES.length)
                setSpin(spin + 1)
              }}
              className="pressable flex items-center gap-[6px] text-[11px] text-ink"
            >
              <motion.img src={iconRefresh} alt="" className="h-4 w-4" animate={{ rotate: spin * 360 }} transition={{ duration: 0.5 }} />
              refresh your inspiration
            </button>
          </div>

          {/* Quick Tip balonu (Figma: Card/Get Quick Tip) */}
          <AnimatePresence>
            {tip !== null && (
              <motion.div
                className="absolute inset-x-6 top-full z-30 -mt-[16px]"
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.22 }}
                style={{ transformOrigin: '38px 0' }}
                onClick={() => setTip(null)}
              >
                <img src={tipArrow} alt="" className="absolute left-[32px] top-0 h-[13px] w-[13px]" />
                <div className="mt-[6px] rounded-card border border-black/10 bg-bg px-[15px] py-[18px] shadow-card">
                  <p className="text-[15px] italic leading-[18px] text-ink">“{TIPS[tip]}”</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Beyaz panel */}
        <section
          className="relative min-h-full rounded-t-[24px] bg-bg pt-[5px] transition-opacity duration-200"
          style={{ paddingBottom: TAB_BAR_SPACE, opacity: tip !== null ? 0.5 : 1 }}
        >
          <div className="mx-auto flex w-[25px] flex-col gap-[2px] pb-[14px]">
            <span className="h-px bg-ink" />
            <span className="h-px bg-ink" />
          </div>

          <div className="px-6">
            <h2 className="text-title2 font-semibold text-ink">Daily Summary</h2>
            <div className="mt-[5px] flex items-baseline justify-between text-[18px] leading-[21px] text-ink">
              <span>{dayLabel}</span>
              <span>{month}</span>
            </div>
          </div>

          <DayStrip today={today} selected={selected} onSelect={setSelected} />

          {/* Günlük kartlar */}
          <div className="scroll-x mt-[14px] flex gap-[7px] px-6 py-[3px]" style={{ scrollPaddingInline: 24 }}>
            <DailyCard
              title="Walk"
              img={imgWalk}
              imgSize={[57, 27]}
              value={`${TARGETS.walkKm} km`}
              current={`${log.walkKm} km`}
              pct={p.walk}
              cta={walkActive ? 'Stop' : 'Start'}
              ctaActive={walkActive}
              onCta={toggleWalk}
              onPress={() => nav.push('tracker', { kind: 'walk' })}
              disabled={!isToday}
            />
            <DailyCard
              title="Water"
              img={imgWater}
              imgSize={[38, 41]}
              value={fmtLitres(TARGETS.glasses)}
              current={fmtLitres(log.glasses)}
              pct={p.water}
              cta="Drink"
              onCta={drink}
              onPress={() => nav.push('water-detail')}
              disabled={!isToday}
            />
            <DailyCard
              title="Sleep"
              img={imgSleep}
              imgSize={[48, 35]}
              value={`${TARGETS.sleepMin / 60} hours`}
              current={fmtSleep(log.sleepMin)}
              pct={p.sleep}
              cta="Sleep"
              onCta={() => nav.openSheet((close) => <SleepSheet dayKey={todayKey} close={close} />)}
              onPress={() => nav.push('tracker', { kind: 'sleep' })}
              disabled={!isToday}
            />
            <DailyCard
              title="Food"
              img={imgFood}
              imgSize={[50, 34]}
              value={`${TARGETS.proteinG}g Protein`}
              current={`${log.proteinG} g`}
              pct={p.food}
              cta="Eat"
              onCta={() => nav.openSheet((close) => <MealSheet dayKey={todayKey} close={close} />)}
              onPress={() => nav.push('tracker', { kind: 'food' })}
              disabled={!isToday}
            />
            <button
              onClick={() => soon('Custom trackers')}
              className="pressable flex h-[168px] w-[84px] shrink-0 snap-start flex-col items-center justify-center gap-[10px] rounded-card border border-black/60 text-ink"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
                <path d="M11 1v20M1 11h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[16px]">Add</span>
            </button>
          </div>

          {/* Günlük hedef */}
          <div className="mt-[22px] px-6">
            <div className="flex items-baseline justify-between text-[14px] font-semibold leading-[17px] text-ink">
              <span>{isToday ? 'You’re on track toward today’s goals' : 'Goals completed that day'}</span>
              <span>{p.overall}%</span>
            </div>
            <ProgressBar pct={p.overall} height={6} className="mt-[5px]" />
            <button onClick={() => nav.setTab('ai')} className="pressable mt-[16px] flex w-full items-start gap-[9px] text-left">
              <img src={iconAi} alt="" className="mt-[1px] h-[18px] w-[20px] shrink-0" />
              <span className="text-[12px] leading-[15px] text-ink">{AI_SUGGESTION[goal] ?? AI_SUGGESTION.fitter}</span>
            </button>
          </div>

          {/* Achievements */}
          <div className="mt-[22px]">
            <SectionTitle title="Achievements" onSeeAll={() => soon('All achievements')} />
            <div className="scroll-x mt-[8px] flex gap-[7px] px-6 py-[3px]" style={{ scrollPaddingInline: 24 }}>
              {ACHIEVEMENTS.map((a) => (
                <SmallCard
                  key={a.id}
                  title={a.title}
                  icon={a.icon}
                  text={a.text}
                  footer={
                    a.progress ? (
                      <CardProgress value={a.progress.value} pct={a.progress.pct} />
                    ) : (
                      <CardButton
                        label={claimed.includes(a.id) ? 'Claimed ✓' : 'Claim'}
                        active={claimed.includes(a.id)}
                        onClick={() => {
                          if (!claimed.includes(a.id)) toast(`🏅 ${a.title} badge claimed!`)
                          toggleClaim(a.id)
                        }}
                      />
                    )
                  }
                />
              ))}
            </div>
          </div>

          {/* Daily Challenge */}
          <div className="mt-[22px]">
            <SectionTitle title="Daily Challenge" onSeeAll={() => soon('All challenges')} />
            <div className="scroll-x mt-[8px] flex gap-[7px] px-6 py-[3px]" style={{ scrollPaddingInline: 24 }}>
              {CHALLENGES.map((c) => {
                const on = accepted.includes(c.id)
                return (
                  <SmallCard
                    key={c.id}
                    title={c.title}
                    icon={c.icon}
                    text={c.text}
                    footer={<CardButton label={on ? 'Accepted' : 'Accept!'} active={on} onClick={() => toggleAccept(c.id)} />}
                  />
                )
              })}
            </div>
          </div>
        </section>

        {/* Quick Tip açıkken boş yere dokununca kapanır */}
        {tip !== null && <div className="absolute inset-0 z-20" onClick={() => setTip(null)} />}
      </main>
    </div>
  )
}
