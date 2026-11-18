/**
 * Walk / Sleep / Food detayları – Drink Water (Figma: Home Page-4) şablonuyla.
 * Aynı parçalar: üst bar, görsel, açıklama, bugünkü ilerleme + butonlar, istatistikler, rozetler, geçmiş grafiği.
 */
import { useMemo } from 'react'
import { useNav, type ScreenProps } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { Header } from '../components/Header'
import { TAB_BAR_SPACE } from '../components/TabBar'
import { ProgressBar } from '../components/Cards'
import { BadgesCard, DetailTopBar, HistoryChart, StatCard } from '../components/DetailParts'
import { useVita } from '../store'
import { addDays, dateKey, fmtSleep, progressOf, seedLog, startOfToday, TARGETS, type DayLog } from '../data/daily'
import { MealSheet, SleepSheet } from './QuickLogSheets'
import walkPhoto from '../../assets/discover/hl-3.jpg'
import foodPhoto from '../../assets/home/food.jpg'
import imgSleep from '../../assets/home/img-sleep.svg'
import statSessions from '../../assets/home/stat-sessions.svg'
import statBest from '../../assets/home/stat-best.svg'
import statStreak from '../../assets/home/stat-streak.svg'
import achBronze from '../../assets/home/ach-bronze.svg'
import achSleep from '../../assets/home/ach-sleep.svg'
import achChef from '../../assets/home/ach-chef.svg'
import chStep from '../../assets/home/ch-step.svg'
import chBreathe from '../../assets/home/ch-breathe.svg'
import chMind from '../../assets/home/ch-mind.svg'
import foodIcon from '../../assets/home/img-food.svg'
import walkIcon from '../../assets/home/img-walk.svg'

export type TrackerKind = 'walk' | 'sleep' | 'food'

type Cfg = {
  title: string
  heading: string
  body: string
  value: (l: DayLog) => number
  pct: (l: DayLog) => number
  progressText: (l: DayLog) => string
  chart: { title: string; unit: string; ticks: number[]; max: number; color: string }
  stat: (vals: number[]) => [string, string][]
  badges: string[]
  goodDay: (v: number) => boolean
}

const CFG: Record<TrackerKind, Cfg> = {
  walk: {
    title: 'Walk',
    heading: 'Every step counts.',
    body: 'Walking is one of the simplest ways to boost your mood, support your heart and keep your energy steady. Short walks after meals help balance blood sugar, and a brisk 30-minute walk most days builds real fitness over time — no equipment needed.',
    value: (l) => l.walkKm,
    pct: (l) => progressOf(l).walk,
    progressText: (l) => {
      const left = Math.max(0, +(TARGETS.walkKm - l.walkKm).toFixed(1))
      return left > 0 ? `You’ve walked ${l.walkKm} km today — ${left} km to go!` : `Goal reached — ${l.walkKm} km today. Amazing! 🎉`
    },
    chart: { title: 'My Walking History', unit: 'km', ticks: [12, 10, 8, 6, 4, 2], max: 12, color: '#8EC5B8' },
    stat: (v) => [
      ['Weekly Distance', `${+v.reduce((a, b) => a + b, 0).toFixed(1)} km`],
      ['Best Day Record', `${Math.max(...v)} km`],
    ],
    badges: [achBronze, chStep, walkIcon],
    goodDay: (v) => v >= 5,
  },
  sleep: {
    title: 'Sleep',
    heading: 'Rest is part of the plan.',
    body: 'Good sleep helps your body recover, sharpens focus and keeps cravings in check. Most adults feel best with 7–9 hours. A regular bedtime, a cool dark room and a screen-free wind-down make the biggest difference.',
    value: (l) => +(l.sleepMin / 60).toFixed(1),
    pct: (l) => progressOf(l).sleep,
    progressText: (l) => {
      const short = TARGETS.sleepMin - l.sleepMin
      return short > 0 ? `You slept ${fmtSleep(l.sleepMin)} last night — ${fmtSleep(short).replace(/^0h /, '')} short of your 8-hour goal.` : `You slept ${fmtSleep(l.sleepMin)} — goal reached! 🌙`
    },
    chart: { title: 'My Sleep History', unit: 'Hour', ticks: [10, 8, 6, 4, 2], max: 10, color: '#A2CECE' },
    stat: (v) => [
      ['Average Sleep', `${+(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)} h`],
      ['Best Night', `${Math.max(...v)} h`],
    ],
    badges: [achSleep, chBreathe, chMind],
    goodDay: (v) => v >= 7,
  },
  food: {
    title: 'Food',
    heading: 'Fuel your body well.',
    body: 'Protein keeps you full, supports your muscles and helps you recover after workouts. Spread it across your meals — a palm-sized portion each time — and fill the rest of your plate with colourful vegetables and whole grains.',
    value: (l) => l.proteinG,
    pct: (l) => progressOf(l).food,
    progressText: (l) => {
      const left = TARGETS.proteinG - l.proteinG
      return left > 0 ? `${l.proteinG} g of ${TARGETS.proteinG} g protein today — ${left} g to go!` : `Protein goal reached — ${l.proteinG} g today. Well done! 🥗`
    },
    chart: { title: 'My Protein History', unit: 'Gram', ticks: [200, 160, 120, 80, 40], max: 200, color: '#F1DCB4' },
    stat: (v) => [
      ['Average Protein', `${Math.round(v.reduce((a, b) => a + b, 0) / v.length)} g`],
      ['Best Day Record', `${Math.max(...v)} g`],
    ],
    badges: [achChef, foodIcon],
    goodDay: (v) => v >= 140,
  },
}

export function TrackerDetail({ params }: ScreenProps<{ kind: TrackerKind }>) {
  const nav = useNav()
  const kind = params.kind
  const c = CFG[kind]
  const today = useMemo(startOfToday, [])
  const todayKey = dateKey(today)
  const logs = useVita((s) => s.logs)
  const walkActive = useVita((s) => s.walkActive)
  const setWalkActive = useVita((s) => s.setWalkActive)
  const updateLog = useVita((s) => s.updateLog)

  const logOf = (k: string) => ({ ...seedLog(k), ...logs[k] })
  const log = logOf(todayKey)
  const pct = c.pct(log)
  const history = Array.from({ length: 8 }, (_, i) => {
    const d = addDays(today, i - 7)
    return { day: d.getDate(), value: c.value(logOf(dateKey(d))), isToday: i === 7 }
  })
  const week = history.slice(1).map((h) => h.value)
  let streak = 0
  for (let i = history.length - 1; i >= 0 && c.goodDay(history[i].value); i--) streak++
  if (streak === 0) for (let i = history.length - 2; i >= 0 && c.goodDay(history[i].value); i--) streak++
  const [s1, s2] = c.stat(week)

  /* Bugünkü ilerleme butonları (Drink Water'daki Cancel / Drink çiftinin karşılığı) */
  const actions =
    kind === 'walk'
      ? [
          {
            label: walkActive ? 'Stop walk' : 'Start walk',
            tone: walkActive ? 'coral' : 'brand',
            onClick: () => {
              setWalkActive(!walkActive)
              toast(walkActive ? `🚶 Walk saved · ${log.walkKm} km today` : '🚶 Walk started — keep moving!')
            },
          },
          {
            label: '+0.5 km',
            tone: 'mint',
            onClick: () => {
              updateLog(todayKey, (l) => ({ walkKm: Math.round((l.walkKm + 0.5) * 10) / 10 }))
              toast('+0.5 km logged')
            },
          },
        ]
      : kind === 'sleep'
        ? [
            { label: 'Log sleep', tone: 'brand', onClick: () => nav.openSheet((close) => <SleepSheet dayKey={todayKey} close={close} />) },
            {
              label: 'Wind-down tips',
              tone: 'mint',
              onClick: () =>
                nav.openSheet(() => (
                  <div className="flex flex-col gap-3 px-6 pb-8 pt-1">
                    <h2 className="text-title3 font-semibold">Wind-down tips 🌙</h2>
                    <ul className="list-disc pl-5 text-[15px] leading-[22px] text-black/70">
                      <li>Dim screens an hour before bed</li>
                      <li>Keep your room cool and dark</li>
                      <li>Try 5 minutes of slow breathing</li>
                      <li>Go to bed at the same time each night</li>
                    </ul>
                  </div>
                )),
            },
          ]
        : [
            { label: 'Log a meal', tone: 'brand', onClick: () => nav.openSheet((close) => <MealSheet dayKey={todayKey} close={close} />) },
            { label: 'Browse recipes', tone: 'mint', onClick: () => nav.push('discover-list', { section: 'recipes' }) },
          ]

  const toneClass: Record<string, string> = { brand: 'bg-brand text-white', mint: 'bg-mint text-white', coral: 'bg-coral text-ink' }

  return (
    <div className="flex h-full flex-col bg-bg">
      <Header title="Vita" />
      <main className="scroll-y min-h-0 flex-1 px-6 pt-[12px]" style={{ paddingBottom: TAB_BAR_SPACE }}>
        <DetailTopBar saveId={kind} shareText={`${c.heading} — tracking my ${c.title.toLowerCase()} with Vita.`} />

        <h1 className="mt-[2px] text-title3 font-semibold text-ink">{c.title}</h1>
        {kind === 'sleep' ? (
          <div className="mt-[6px] flex h-[106px] w-full items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#DDEBEA,#F3E0AF)]">
            <img src={imgSleep} alt="" className="h-[70px] w-auto" />
          </div>
        ) : (
          <img
            src={kind === 'walk' ? walkPhoto : foodPhoto}
            alt=""
            className="mt-[6px] h-[106px] w-full rounded-[22px] object-cover"
            style={{ objectPosition: kind === 'walk' ? '50% 55%' : '50% 50%' }}
          />
        )}

        <h2 className="mt-[12px] text-[15px] font-semibold leading-[18px] text-ink">{c.heading}</h2>
        <p className="mt-[6px] text-[13px] leading-[17px] text-ink/85">{c.body}</p>

        <section className="mt-[24px]">
          <p className="text-[13px] font-semibold leading-[16px] text-ink">{c.progressText(log)}</p>
          <ProgressBar pct={pct} height={9} className="mt-[8px]" />
          <div className="mt-[6px] flex items-center justify-between">
            <div className="flex gap-[7px]">
              {actions.map((a) => (
                <button key={a.label} onClick={a.onClick} className={`pressable h-[26px] rounded-chip px-[14px] text-[12px] font-medium shadow-btn ${toneClass[a.tone]}`}>
                  {a.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-medium text-ink">{pct}%</span>
          </div>
        </section>

        <section className="mt-[22px] grid grid-cols-3 gap-[6px]">
          <StatCard title={s1[0]} icon={statSessions} iconSize={[28, 29]} label={s1[1]} />
          <StatCard title={s2[0]} icon={statBest} iconSize={[27, 33]} label={s2[1]} />
          <StatCard title="Streak" icon={statStreak} iconSize={[15, 24]} label={`${streak}-day streak`} />
        </section>

        <BadgesCard badges={c.badges} />

        <HistoryChart
          title={c.chart.title}
          unit={c.chart.unit}
          ticks={c.chart.ticks}
          max={c.chart.max}
          data={history}
          color={c.chart.color}
          todayColor="#0BB791"
        />
      </main>
    </div>
  )
}
