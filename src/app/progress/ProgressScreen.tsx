/** Figma: Progress-1 / -2 / -3 */
import { useState } from 'react'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { ScreenLayout } from '../components/ScreenLayout'
import { ProgressBar } from '../components/Cards'
import { PrimaryButton } from '../components/PrimaryButton'
import { useVita } from '../store'
import { dateKey, progressOf, seedLog, startOfToday } from '../data/daily'
import {
  avgProgress,
  comparison,
  GOAL_SECTIONS,
  goalPct,
  healthScore,
  medStats,
  METRICS,
  RANGES,
  seedMed,
  statusColor,
  statusOf,
  WELLNESS,
  wellnessLabel,
  type Goal,
  type Metric,
  type Period,
  type Range,
} from '../data/progress'
import { GoalCard, OptionsButton, PeriodTabs, RangeTabs, Ring } from './ProgressParts'
import iconAi from '../../assets/home/icon-ai.svg'
import iconOptions from '../../assets/progress/icon-options.svg'

const PERIODS: Period[] = ['Daily', 'Weekly', 'Monthly']
const WELL_COLORS = ['#0BB791', '#F1DCB4', '#F6A087']
const WELL_LABELS = ['Body & Activity', 'Mental Wellness', 'Nutrition & Hydration']

export function ProgressScreen() {
  const nav = useNav()
  const logs = useVita((s) => s.logs)
  const med = useVita((s) => s.med)
  const addedGoals = useVita((s) => s.addedGoals)
  const goalBoost = useVita((s) => s.goalBoost)
  const addGoal = useVita((s) => s.addGoal)
  const boostGoal = useVita((s) => s.boostGoal)

  const [range, setRange] = useState<Range>('W')
  const [wRange, setWRange] = useState<Range>('W')
  const [cmpPeriod, setCmpPeriod] = useState<Period>('Weekly')
  const [metric, setMetric] = useState<Metric>('overall')
  const [goalPeriod, setGoalPeriod] = useState<Period>('Weekly')
  const [sorted, setSorted] = useState(false)

  const score = healthScore(logs, range)
  const cmp = comparison(logs, cmpPeriod, metric)
  const ms = medStats(med)
  const todayKey = dateKey(startOfToday())

  /** Hedef yüzdesi: Meditation ve Hydration gerçek kayıtlardan, diğerleri demo */
  const pctOf = (g: Goal) => {
    const boost = goalBoost[g.id] ?? 0
    if (g.link === 'meditation') {
      const v = goalPeriod === 'Daily' ? Math.round(({ ...seedMed(todayKey), ...med[todayKey] }.min / 21) * 100) : goalPeriod === 'Weekly' ? ms.pct : ms.pct - 8
      return Math.max(0, Math.min(100, v + boost))
    }
    if (g.link === 'water') {
      const v = goalPeriod === 'Daily' ? progressOf({ ...seedLog(todayKey), ...logs[todayKey] }).water : avgProgress(logs, goalPeriod === 'Weekly' ? 7 : 30, 0, 'water')
      return Math.min(100, v + boost)
    }
    return goalPct(g, goalPeriod, boost)
  }

  const openGoal = (g: Goal) => {
    if (g.link === 'meditation') return nav.push('meditation')
    if (g.link === 'water') return nav.push('water-detail')
    nav.openSheet((close) => <GoalSheet goal={g} pct={pctOf(g)} onLog={() => { boostGoal(g.id, 10); toast(`${g.title} · +10% logged`); close() }} />)
  }

  const openAdd = (sectionId: string) => {
    const s = GOAL_SECTIONS.find((x) => x.id === sectionId)!
    const available = s.extra.filter((g) => !addedGoals.includes(g.id))
    nav.openSheet((close) => (
      <div className="flex flex-col gap-3 px-6 pb-6 pt-1">
        <h2 className="text-title3 font-semibold">Add to {s.title}</h2>
        {available.length === 0 ? (
          <p className="text-[14px] text-black/55">You’ve added all suggested goals for this category.</p>
        ) : (
          available.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                addGoal(g.id)
                toast(`🎯 ${g.title} added to your goals`)
                close()
              }}
              className="pressable flex items-center justify-between gap-3 rounded-card border border-black/10 bg-bg px-[18px] py-[12px] text-left shadow-card"
            >
              <span>
                <span className="block text-[15px] font-semibold text-ink">{g.title}</span>
                <span className="block text-[12px] text-black/55">{g.text}</span>
              </span>
              <span className="rounded-chip bg-mint px-[10px] py-[3px] text-[12px] font-medium text-white">Add</span>
            </button>
          ))
        )}
      </div>
    ))
  }

  const openMetric = () =>
    nav.openSheet((close) => (
      <div className="flex flex-col gap-3 px-6 pb-6 pt-1">
        <h2 className="text-title3 font-semibold">Compare</h2>
        <div className="grid grid-cols-2 gap-[10px]">
          {METRICS.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMetric(m.id)
                close()
              }}
              className={`pressable h-[46px] rounded-[16px] border text-[15px] font-medium ${m.id === metric ? 'border-brand bg-brand text-white' : 'border-black/10 bg-bg text-ink shadow-card'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    ))

  return (
    <ScreenLayout title="Progress">
      {/* My Health Stats ↔ My Wellness Balance (yana kaydırılır) */}
      <div className="scroll-x mt-[23px] flex gap-[6px] px-6 pb-[3px]" style={{ scrollPaddingInline: 24 }}>
        <section className="w-full shrink-0 snap-center">
          <h2 className="text-title3 font-semibold text-ink">My Health Stats</h2>
          <div className="relative mt-[8px] h-[132px] rounded-card border border-black/10 bg-bg shadow-card">
            <div className="absolute left-[15px] top-[10px]">
              <h3 className="text-title3 font-semibold text-ink">Overall Health</h3>
              <p className="mt-[14px] flex items-center gap-[4px] text-[12px] text-ink">
                <span className="h-[5px] w-[5px] rounded-full" style={{ background: statusColor(score) }} />
                {statusOf(score)}
              </p>
              <p className="mt-[12px] w-[150px] text-[12px] italic leading-[14px] text-ink">Small daily choices build this balance.</p>
            </div>
            <div className="absolute right-[12px] top-[10px]">
              <RangeTabs options={RANGES} value={range} onChange={setRange} />
            </div>
            <div className="absolute bottom-[10px] right-[34px]">
              <Ring size={84} stroke={8} pct={score} color={statusColor(score)}>
                <span className="text-[20px] font-semibold text-ink">{score}%</span>
              </Ring>
            </div>
          </div>
        </section>

        <section className="w-full shrink-0 snap-center">
          <h2 className="text-title3 font-semibold text-ink">My Wellness Balance</h2>
          <div className="relative mt-[8px] h-[132px] rounded-card border border-black/10 bg-bg shadow-card">
            <div className="absolute right-[12px] top-[8px]">
              <RangeTabs options={RANGES} value={wRange} onChange={setWRange} />
            </div>
            <div className="absolute inset-x-[8px] bottom-[6px] flex justify-between">
              {WELLNESS[wRange].map((v, i) => (
                <div key={i} className="flex w-[100px] flex-col items-center">
                  <Ring size={74} stroke={8} pct={v} color={WELL_COLORS[i]}>
                    <span className="text-[17px] font-semibold leading-none text-ink">{v}%</span>
                    <span className="mt-[3px] flex items-center gap-[2px] text-[11px] leading-none text-ink">
                      <span className="h-[3px] w-[3px] rounded-full" style={{ background: WELL_COLORS[i] }} />
                      {wellnessLabel(v)}
                    </span>
                  </Ring>
                  <span className="mt-[4px] whitespace-nowrap text-[11px] tracking-[-0.2px] text-ink">{WELL_LABELS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Summary Comparison */}
      <section className="mt-[30px] px-6">
        <h2 className="text-title3 font-semibold text-ink">Summary Comparison</h2>
        <div className="mt-[8px] flex items-center justify-between">
          <PeriodTabs options={PERIODS} value={cmpPeriod} onChange={setCmpPeriod} />
          <OptionsButton icon={iconOptions} onClick={openMetric} label="Choose metric" />
        </div>
        <p className="mt-[8px] text-[12px] text-ink">
          {cmp.range}
          {metric !== 'overall' && <span className="text-black/50"> · {METRICS.find((m) => m.id === metric)?.label}</span>}
        </p>
        <div className="mt-[8px] flex flex-col gap-[6px]">
          {[
            { v: cmp.cur, color: '#0BB791' },
            { v: cmp.prev, color: '#F6A087' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-[8px]">
              <div className="h-[15px] flex-1 overflow-hidden rounded-[4px] bg-white">
                <div className="h-full rounded-[4px] transition-[width] duration-700" style={{ width: `${b.v}%`, background: b.color }} />
              </div>
              <span className="w-[30px] text-right text-[11px] text-ink">{b.v}%</span>
            </div>
          ))}
        </div>
        <div className="mt-[6px] flex gap-[12px] text-[11px] text-ink">
          <span className="flex items-center gap-[4px]">
            <span className="h-[4px] w-[4px] rounded-full bg-brand" />
            {cmp.labels[0]}
          </span>
          <span className="flex items-center gap-[4px]">
            <span className="h-[4px] w-[4px] rounded-full bg-[#F6A087]" />
            {cmp.labels[1]}
          </span>
        </div>
        <div className="mt-[18px] flex items-start gap-[9px]">
          <img src={iconAi} alt="" className="h-[18px] w-[20px] shrink-0" />
          <p className="text-[12px] leading-[15px] text-ink">
            “{cmp.diff > 0 ? <>Awesome! You’ve improved by <span className="text-brand">{cmp.diff}%</span> since {cmp.message.split(' since ')[1]}</> : cmp.message}”
          </p>
        </div>
      </section>

      {/* Your Goals */}
      <section className="mt-[30px] pb-6">
        <div className="px-6">
          <h2 className="text-title3 font-semibold text-ink">Your Goals</h2>
          <div className="mt-[8px] flex items-center justify-between">
            <PeriodTabs options={PERIODS} value={goalPeriod} onChange={setGoalPeriod} />
            <OptionsButton
              icon={iconOptions}
              label="Sort goals"
              onClick={() => {
                setSorted(!sorted)
                toast(sorted ? 'Default order' : 'Sorted by progress')
              }}
            />
          </div>
        </div>

        {GOAL_SECTIONS.map((s) => {
          let goals = [...s.goals, ...s.extra.filter((g) => addedGoals.includes(g.id))]
          if (sorted) goals = goals.sort((a, b) => pctOf(b) - pctOf(a))
          return (
            <div key={s.id} className="mt-[18px]">
              <div className="flex items-center justify-between px-6">
                <h3 className="flex items-center gap-[5px] text-[16px] font-semibold text-ink">
                  <span className="flex w-[14px] flex-col gap-[2px]">
                    <span className="h-px bg-ink" />
                    <span className="h-px bg-ink" />
                  </span>
                  {s.title}
                </h3>
                <button aria-label={`Add to ${s.title}`} onClick={() => openAdd(s.id)} className="pressable -my-1 px-1 text-[26px] font-extralight leading-none text-ink">
                  +
                </button>
              </div>
              <div className="scroll-x mt-[6px] flex gap-[6px] px-6 py-[3px]" style={{ scrollPaddingInline: 24 }}>
                {goals.map((g) => (
                  <GoalCard key={g.id} title={g.title} text={g.text} value={g.value} pct={pctOf(g)} onPress={() => openGoal(g)} />
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </ScreenLayout>
  )
}

function GoalSheet({ goal, pct, onLog }: { goal: Goal; pct: number; onLog: () => void }) {
  return (
    <div className="flex flex-col gap-3 px-6 pb-6 pt-1">
      <h2 className="text-title3 font-semibold">{goal.title}</h2>
      <p className="text-[14px] leading-[19px] text-black/60">{goal.text}</p>
      <div>
        <ProgressBar pct={pct} height={9} />
        <p className="mt-[4px] text-right text-[12px] font-medium">{pct}%</p>
      </div>
      <PrimaryButton size="lg" onClick={onLog} disabled={pct >= 100}>
        {pct >= 100 ? 'Goal complete 🎉' : 'Log progress'}
      </PrimaryButton>
    </div>
  )
}
