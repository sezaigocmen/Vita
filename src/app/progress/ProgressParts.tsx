/** Progress ekranı parçaları: halka grafik, sekmeler, hedef kartı */
import { motion } from 'motion/react'
import { ProgressBar } from '../components/Cards'

/** Figma: Chart/percentage – gri iz üzerinde renkli yay */
export function Ring({ size, stroke, pct, color, children }: { size: number; stroke: number; pct: number; color: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#D9D9D9" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct / 100) }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

/** Y · D · W · M · 3M */
export function RangeTabs<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex items-center gap-[2px]">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`pressable flex h-[18px] min-w-[20px] items-center justify-center rounded-[6px] px-[4px] text-[11px] font-medium text-ink ${
            o === value ? 'border border-black/60' : 'border border-transparent'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/** Daily · Weekly · Monthly */
export function PeriodTabs<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex items-center gap-[6px]">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`pressable h-[22px] rounded-[6px] px-[12px] text-[13px] font-medium text-ink transition-shadow ${
            o === value ? 'border border-black/10 bg-bg shadow-card' : 'border border-transparent'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/** Figma: Component/Card/Stats/Details (193×63) */
export function GoalCard({ title, text, pct, value, onPress }: { title: string; text: string; pct: number; value?: string; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="pressable relative flex h-[66px] w-[200px] shrink-0 snap-start flex-col rounded-[22px] border border-black/10 bg-bg px-[10px] pt-[8px] text-left shadow-card"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[14px] font-semibold leading-[17px] text-ink">{title}</span>
        <div className="mt-[4px] w-[64px] shrink-0">
          <ProgressBar pct={pct} />
          <span className="mt-[2px] flex justify-between text-[11px] font-medium leading-[12px] tracking-[-0.2px] text-ink">
            <span>{value ?? ''}</span>
            <span>{pct}%</span>
          </span>
        </div>
      </div>
      <span className="mt-[2px] line-clamp-2 text-[11px] leading-[13px] text-ink">{text}</span>
    </button>
  )
}

/** Figma: Icon/Your Goals/Options – üç çizgili filtre ikonu */
export function OptionsButton({ icon, onClick, label }: { icon: string; onClick: () => void; label: string }) {
  return (
    <button aria-label={label} onClick={onClick} className="pressable -m-2 p-2">
      <img src={icon} alt="" className="h-[11px] w-[16px]" />
    </button>
  )
}
