/** Figma: Progress-4 / -5 – Meditation detayı */
import { useMemo } from 'react'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { Header } from '../components/Header'
import { TAB_BAR_SPACE } from '../components/TabBar'
import { ProgressBar } from '../components/Cards'
import { BadgesCard, DetailTopBar, HistoryChart, StatCard } from '../components/DetailParts'
import { useVita } from '../store'
import { addDays, dateKey, startOfToday } from '../data/daily'
import { medStats, seedMed } from '../data/progress'
import meditationImg from '../../assets/progress/meditation.png'
import statSessions from '../../assets/progress/stat-sessions-med.svg'
import statMinutes from '../../assets/progress/stat-minutes.svg'
import statStreak from '../../assets/progress/stat-streak-med.svg'
import b1 from '../../assets/progress/med-badge-1.svg'
import b2 from '../../assets/progress/med-badge-2.svg'
import b3 from '../../assets/progress/med-badge-3.svg'
import b4 from '../../assets/progress/med-badge-4.svg'

const DURATIONS = [5, 10, 15, 20]

export function MeditationDetail() {
  const nav = useNav()
  const today = useMemo(startOfToday, [])
  const todayKey = dateKey(today)
  const med = useVita((s) => s.med)
  const addMeditation = useVita((s) => s.addMeditation)
  const stats = medStats(med)

  const history = Array.from({ length: 8 }, (_, i) => {
    const d = addDays(today, i - 7)
    const k = dateKey(d)
    return { day: d.getDate(), value: { ...seedMed(k), ...med[k] }.min, isToday: i === 7 }
  })

  const startNew = () =>
    nav.openSheet((close) => (
      <div className="flex flex-col gap-4 px-6 pb-6 pt-1">
        <div>
          <h2 className="text-title3 font-semibold">New session</h2>
          <p className="mt-1 text-[14px] text-black/55">How long would you like to meditate?</p>
        </div>
        <div className="grid grid-cols-4 gap-[8px]">
          {DURATIONS.map((m) => (
            <button
              key={m}
              onClick={() => {
                addMeditation(todayKey, m, true)
                toast(`🧘 ${m}-min session complete`)
                close()
              }}
              className="pressable flex h-[58px] flex-col items-center justify-center rounded-[18px] border border-black/10 bg-bg shadow-card"
            >
              <span className="text-[18px] font-semibold text-ink">{m}</span>
              <span className="text-[11px] text-black/50">min</span>
            </button>
          ))}
        </div>
      </div>
    ))

  return (
    <div className="flex h-full flex-col bg-bg">
      <Header title="Progress" />
      <main className="scroll-y min-h-0 flex-1 px-6 pt-[12px]" style={{ paddingBottom: TAB_BAR_SPACE }}>
        <DetailTopBar saveId="meditation" shareText="Building a calm mind, one session at a time — with Vita." />

        <h1 className="mt-[2px] text-title3 font-semibold text-ink">Meditation</h1>
        <img src={meditationImg} alt="Person meditating" className="mt-[6px] h-[106px] w-full rounded-[22px] object-contain" />

        <h2 className="mt-[12px] text-[15px] font-semibold leading-[18px] text-ink">Relax, focus, and recharge your mind daily.</h2>
        <p className="mt-[6px] text-[13px] leading-[17px] text-ink/85">
          Meditation helps you slow down and reconnect with your mind and body. Regular practice reduces stress, improves focus, and strengthens emotional
          well-being. Even 5–10 minutes a day can make a big difference. Explore different techniques like breathing exercises, body scans, or guided sessions to
          find what suits you best.
        </p>

        <section className="mt-[24px]">
          <p className="text-[13px] font-bold leading-[16px] text-ink">Your Current Progress</p>
          <ProgressBar pct={stats.pct} height={9} color="#F3997E" className="mt-[8px]" />
          <div className="mt-[6px] flex items-center justify-between">
            <div className="flex gap-[7px]">
              <button
                onClick={() => {
                  addMeditation(todayKey, 5, false)
                  toast('+5 min · session continued')
                }}
                className="pressable h-[26px] rounded-chip bg-coral px-[14px] text-[12px] font-medium text-ink shadow-btn"
              >
                Continue
              </button>
              <button onClick={startNew} className="pressable h-[26px] rounded-chip bg-brand px-[14px] text-[12px] font-medium text-white shadow-btn">
                Start New Session
              </button>
            </div>
            <span className="text-[11px] font-medium text-ink">{stats.pct}%</span>
          </div>
          <p className="mt-[4px] text-[11px] text-black/50">{stats.minutes} of 150 minutes this week</p>
        </section>

        <section className="mt-[20px] grid grid-cols-3 gap-[6px]">
          <StatCard title="Session Count" icon={statSessions} iconSize={[28, 29]} label={`${stats.sessions} sessions`} />
          <StatCard title="Total Minutes" icon={statMinutes} iconSize={[28, 32]} label={`${stats.minutes} minutes`} />
          <StatCard title="Streak" icon={statStreak} iconSize={[15, 24]} label={`${stats.streak}-day streak`} />
        </section>

        <BadgesCard badges={[b1, b2, b3, b4]} />

        <HistoryChart
          title="My Meditation History"
          unit="Minute"
          ticks={[30, 25, 20, 15, 10, 5]}
          max={30}
          data={history}
          color="#F3997E"
          todayColor="#E9805F"
        />
      </main>
    </div>
  )
}
