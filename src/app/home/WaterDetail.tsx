/** Figma: Home Page-4 – Drink Water detayı */
import { useMemo } from 'react'
import { toast } from '../../shell/toast'
import { Header } from '../components/Header'
import { TAB_BAR_SPACE } from '../components/TabBar'
import { ProgressBar } from '../components/Cards'
import { BadgesCard, DetailTopBar, HistoryChart, StatCard } from '../components/DetailParts'
import { useVita } from '../store'
import { addDays, dateKey, GLASS_ML, seedLog, startOfToday, TARGETS } from '../data/daily'
import waterImg from '../../assets/home/water.jpg'
import statSessions from '../../assets/home/stat-sessions.svg'
import statBest from '../../assets/home/stat-best.svg'
import statStreak from '../../assets/home/stat-streak.svg'
import badge1 from '../../assets/home/badge-1.svg'
import badge2 from '../../assets/home/badge-2.svg'
import badge3 from '../../assets/home/badge-3.svg'
import badge4 from '../../assets/home/badge-4.svg'

export function WaterDetail() {
  const today = useMemo(startOfToday, [])
  const todayKey = dateKey(today)
  const logs = useVita((s) => s.logs)
  const addGlasses = useVita((s) => s.addGlasses)

  const history = Array.from({ length: 8 }, (_, i) => {
    const d = addDays(today, i - 7)
    const k = dateKey(d)
    const glasses = { ...seedLog(k), ...logs[k] }.glasses
    return { day: d.getDate(), value: (glasses * GLASS_ML) / 1000, isToday: i === 7 }
  })
  const glasses = { ...seedLog(todayKey), ...logs[todayKey] }.glasses
  const pct = Math.min(100, Math.round((glasses / TARGETS.glasses) * 100))
  const left = TARGETS.glasses - glasses
  const best = Math.max(...history.map((h) => h.value))

  return (
    <div className="flex h-full flex-col bg-bg">
      <Header title="Vita" />
      <main className="scroll-y min-h-0 flex-1 px-6 pt-[12px]" style={{ paddingBottom: TAB_BAR_SPACE }}>
        <DetailTopBar saveId="water" shareText="Hydration is energy — tracking my water with Vita." />

        <h1 className="mt-[2px] text-title3 font-semibold text-ink">Drink Water</h1>
        <img src={waterImg} alt="Glass of water" className="mt-[6px] h-[106px] w-full rounded-[22px] object-cover" />

        <h2 className="mt-[12px] text-[15px] font-semibold leading-[18px] text-ink">Hydration is energy.</h2>
        <p className="mt-[6px] text-[13px] leading-[17px] text-ink/85">
          Water is essential for every part of your body — from your brain to your muscles. Staying hydrated helps regulate body temperature, improve energy
          levels, and support digestion. On average, adults are recommended to drink around 2–3 liters (8–10 glasses) of water per day, though this can vary
          depending on activity level and climate.
        </p>

        {/* Bugünkü ilerleme (Figma: Component 13) */}
        <section className="mt-[24px]">
          <p className="text-[13px] font-semibold leading-[16px] text-ink">
            {left > 0
              ? `You’ve had ${glasses} glasses today — only ${left} more to reach your goal!`
              : `Goal reached — ${glasses} glasses today. Great job! 🎉`}
          </p>
          <ProgressBar pct={pct} height={9} className="mt-[8px]" />
          <div className="mt-[6px] flex items-center justify-between">
            <div className="flex gap-[7px]">
              <button
                onClick={() => addGlasses(todayKey, -1)}
                disabled={glasses === 0}
                className="pressable h-[26px] rounded-chip bg-coral px-[14px] text-[12px] font-medium text-ink shadow-btn disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addGlasses(todayKey, 1)
                  toast(`+${GLASS_ML} ml water 💧`)
                }}
                className="pressable h-[26px] rounded-chip bg-brand px-[22px] text-[12px] font-medium text-white shadow-btn"
              >
                Drink
              </button>
            </div>
            <span className="text-[11px] font-medium text-ink">{pct}%</span>
          </div>
        </section>

        <section className="mt-[22px] grid grid-cols-3 gap-[6px]">
          <StatCard title="Session Count" icon={statSessions} iconSize={[28, 29]} label="18 sessions" />
          <StatCard title="Best Day Record" icon={statBest} iconSize={[27, 33]} label={`${+best.toFixed(1)} L`} />
          <StatCard title="Streak" icon={statStreak} iconSize={[15, 24]} label="9-day streak" />
        </section>

        <BadgesCard badges={[badge1, badge2, badge3, badge4]} />

        <HistoryChart title="My Drink Water History" unit="Litre" ticks={[3, 2.5, 2, 1.5, 1, 0.5]} max={3} data={history} color="#8EC5B8" todayColor="#0BB791" />
      </main>
    </div>
  )
}
