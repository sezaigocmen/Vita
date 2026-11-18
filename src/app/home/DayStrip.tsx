/** Figma: Chart/12…22 – günlük ilerleme halkalarıyla tarih şeridi (7 gün geri, bugün, 3 gün ileri) */
import { motion } from 'motion/react'
import { useVita } from '../store'
import { addDays, dateKey, progressOf, seedLog } from '../data/daily'

const R = 11.5
const C = 2 * Math.PI * R

export function DayStrip({ today, selected, onSelect }: { today: Date; selected: string; onSelect: (key: string) => void }) {
  const logs = useVita((s) => s.logs)
  const days = Array.from({ length: 11 }, (_, i) => addDays(today, i - 7))

  return (
    <div className="mt-[9px] flex justify-between px-6">
      {days.map((d, i) => {
        const key = dateKey(d)
        const future = i > 7
        const pct = future ? 0 : progressOf({ ...seedLog(key), ...logs[key] }).overall
        const isSel = key === selected
        return (
          <button
            key={key}
            disabled={future}
            onClick={() => onSelect(key)}
            aria-label={d.toDateString()}
            className="pressable relative flex h-[34px] w-[27px] flex-col items-center"
          >
            <span className="relative flex h-[27px] w-[27px] items-center justify-center">
              <svg width="27" height="27" viewBox="0 0 27 27" className="absolute inset-0 -rotate-90">
                <circle cx="13.5" cy="13.5" r={R} fill="none" stroke="#000" strokeWidth="2.5" />
                <motion.circle
                  cx="13.5"
                  cy="13.5"
                  r={R}
                  fill="none"
                  stroke="#0BB791"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={false}
                  animate={{ strokeDashoffset: C * (1 - pct / 100) }}
                  transition={{ duration: 0.6 }}
                />
              </svg>
              <span className="relative text-[11px] leading-none text-ink">{d.getDate()}</span>
            </span>
            {isSel && <motion.span layoutId="day-underline" className="absolute bottom-0 h-px w-[27px] bg-ink" />}
          </button>
        )
      })}
    </div>
  )
}
