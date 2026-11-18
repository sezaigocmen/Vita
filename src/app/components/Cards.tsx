/**
 * Figma kartları:
 *  - DailyCard  → Component/Home/large section (Walk / Water / Sleep / Food)
 *  - SmallCard  → Component/Home/medium/1 ve /2 (Achievements, Daily Challenge)
 *  - ProgressBar → Bar/percentage (siyah zemin, yeşil dolum)
 */
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function ProgressBar({ pct, height = 4, className = '', color = '#0BB791' }: { pct: number; height?: number; className?: string; color?: string }) {
  return (
    <div className={`overflow-hidden rounded-[6px] bg-ink ${className}`} style={{ height }}>
      <motion.div
        className="h-full rounded-[6px]"
        style={{ background: color }}
        initial={false}
        animate={{ width: `${Math.max(pct, pct > 0 ? 8 : 0)}%` }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      />
    </div>
  )
}

const cardBase = 'relative flex shrink-0 snap-start flex-col items-center overflow-hidden rounded-card border border-black/10 bg-bg shadow-card'

export function DailyCard({
  title,
  img,
  imgSize,
  value,
  current,
  pct,
  cta,
  onCta,
  onPress,
  disabled,
  ctaActive,
}: {
  ctaActive?: boolean
  title: string
  img: string
  imgSize: [number, number]
  value: string
  current: string
  pct: number
  cta: string
  onCta: () => void
  onPress?: () => void
  disabled?: boolean
}) {
  return (
    <div className={`${cardBase} h-[168px] w-[84px]`}>
      <button onClick={onPress} className="pressable flex w-full flex-1 flex-col items-center pt-[15px]" aria-label={`${title} details`}>
        <span className="text-[14px] font-medium leading-[17px] text-ink">{title}</span>
        <span className="flex h-[52px] items-center justify-center">
          <img src={img} alt="" style={{ width: imgSize[0], height: imgSize[1] }} />
        </span>
        <span className="mt-[6px] whitespace-nowrap text-[12px] font-medium leading-[14px] text-ink">{value}</span>
        <ProgressBar pct={pct} className="mt-[6px] w-[56px]" />
        <span className="mt-[4px] flex w-[70px] justify-between gap-[3px] text-[11px] font-medium leading-[13px] tracking-[-0.2px] text-ink">
          <span className="whitespace-nowrap">{current}</span>
          <span>{pct}%</span>
        </span>
      </button>
      <button
        onClick={onCta}
        disabled={disabled}
        className={`pressable mt-[6px] h-[26px] w-full rounded-b-card text-[14px] font-medium shadow-btn transition-colors disabled:opacity-50 ${
          ctaActive ? 'bg-coral text-ink' : 'bg-mint text-white'
        }`}
      >
        {cta}
      </button>
    </div>
  )
}

export function SmallCard({
  title,
  icon,
  text,
  footer,
}: {
  title: string
  icon: string
  text: string
  footer: ReactNode
}) {
  return (
    <div className={`${cardBase} h-[116px] w-[98px]`}>
      <span className="mt-[11px] w-full truncate px-[3px] text-center text-[11px] font-bold leading-[13px] tracking-[-0.2px] text-ink">{title}</span>
      <span className="flex h-[34px] items-center justify-center">
        <img src={icon} alt="" className="max-h-[32px] max-w-[52px]" />
      </span>
      <span className="line-clamp-2 flex min-h-[26px] items-center px-[5px] text-center text-[11px] font-medium leading-[13px] text-ink">{text}</span>
      <div className="mt-auto w-full">{footer}</div>
    </div>
  )
}

/** Küçük kartın altındaki buton (Claim / Accept!) */
export function CardButton({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`pressable h-[26px] w-full rounded-b-card text-[12px] font-medium shadow-btn transition-colors ${active ? 'bg-brand text-ink' : 'bg-mint text-white'}`}
    >
      {label}
    </button>
  )
}

/** Küçük kartın altındaki ilerleme (Last Sip, Chef in Progress) */
export function CardProgress({ value, pct }: { value: string; pct: number }) {
  return (
    <div className="mx-auto mb-[10px] w-[60px]">
      <ProgressBar pct={pct} />
      <span className="mt-[3px] flex justify-between text-[11px] font-medium leading-[13px] text-ink">
        <span>{value}</span>
        <span>{pct}%</span>
      </span>
    </div>
  )
}

/** Bölüm başlığı + "See All" */
export function SectionTitle({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="flex items-baseline justify-between px-6">
      <h2 className="text-title2 font-semibold text-ink">{title}</h2>
      {onSeeAll && (
        <button onClick={onSeeAll} className="pressable -my-2 py-2 text-[13px] font-semibold text-ink">
          See All
        </button>
      )}
    </div>
  )
}
