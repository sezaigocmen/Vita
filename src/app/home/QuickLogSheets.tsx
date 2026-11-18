/** Sleep ve Eat butonlarının açtığı hızlı kayıt panelleri (sheet içeriği) */
import { toast } from '../../shell/toast'
import { useDayLog, useVita } from '../store'
import { fmtSleep, TARGETS } from '../data/daily'
import { RECIPES } from '../data/discover'

const SLEEP_OPTIONS = [360, 390, 420, 450, 480, 540]

export function SleepSheet({ dayKey, close }: { dayKey: string; close: () => void }) {
  const log = useDayLog(dayKey)
  const updateLog = useVita((s) => s.updateLog)
  return (
    <div className="flex flex-col gap-4 px-6 pb-6 pt-1">
      <div>
        <h2 className="text-title3 font-semibold">How did you sleep?</h2>
        <p className="mt-1 text-[14px] text-black/55">Log last night’s sleep. Your goal is {TARGETS.sleepMin / 60} hours.</p>
      </div>
      <div className="grid grid-cols-3 gap-[10px]">
        {SLEEP_OPTIONS.map((m) => {
          const on = log.sleepMin === m
          return (
            <button
              key={m}
              onClick={() => {
                updateLog(dayKey, () => ({ sleepMin: m }))
                toast(`😴 ${fmtSleep(m)} of sleep logged`)
                close()
              }}
              className={`pressable h-[50px] rounded-[19px] border text-[16px] font-medium transition-colors ${
                on ? 'border-brand bg-brand text-white' : 'border-black/10 bg-bg text-ink shadow-card'
              }`}
            >
              {fmtSleep(m)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const MEALS = RECIPES.map((r) => ({ name: r.title, info: `${r.prep} · ${r.kcal} kcal`, protein: r.protein }))

export function MealSheet({ dayKey, close }: { dayKey: string; close: () => void }) {
  const log = useDayLog(dayKey)
  const updateLog = useVita((s) => s.updateLog)
  return (
    <div className="flex flex-col gap-4 px-6 pb-6 pt-1">
      <div>
        <h2 className="text-title3 font-semibold">What did you eat?</h2>
        <p className="mt-1 text-[14px] text-black/55">
          {log.proteinG} g of {TARGETS.proteinG} g protein today.
        </p>
      </div>
      <ul className="flex flex-col gap-[10px]">
        {MEALS.map((m) => (
          <li key={m.name}>
            <button
              onClick={() => {
                updateLog(dayKey, (c) => ({ proteinG: Math.min(400, c.proteinG + m.protein) }))
                toast(`🥗 ${m.name} logged · +${m.protein} g protein`)
                close()
              }}
              className="pressable flex h-[58px] w-full items-center justify-between rounded-card border border-black/10 bg-bg px-[18px] text-left shadow-card"
            >
              <span className="flex flex-col">
                <span className="text-[15px] font-medium leading-[18px] text-ink">{m.name}</span>
                <span className="text-[12px] leading-[15px] text-black/50">{m.info}</span>
              </span>
              <span className="rounded-chip bg-mint px-[10px] py-[3px] text-[12px] font-medium text-white">+{m.protein} g</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
