/** Detay sayfalarında ortak parçalar (Figma: Home Page-4 ve Progress-4 aynı şablonu kullanıyor) */
import { motion } from 'motion/react'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { useVita } from '../store'
import { BackButton } from './ScreenLayout'
import iconShare from '../../assets/home/icon-share.svg'
import iconSaved from '../../assets/home/icon-saved.svg'

/** Geri · Paylaş · Kaydet */
export function DetailTopBar({ saveId, shareText }: { saveId: string; shareText: string }) {
  const nav = useNav()
  const saved = useVita((s) => s.saved.includes(saveId))
  const toggleSaved = useVita((s) => s.toggleSaved)
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'Vita', text: shareText, url: location.origin })
      else {
        await navigator.clipboard.writeText(location.origin)
        toast('Link copied')
      }
    } catch {
      /* iptal */
    }
  }
  return (
    <div className="flex items-center justify-between">
      <BackButton onClick={nav.pop} />
      <div className="flex items-center gap-[12px]">
        <button aria-label="Share" onClick={share} className="pressable p-2">
          <img src={iconShare} alt="" className="h-4 w-4" />
        </button>
        <button
          aria-label={saved ? 'Remove from saved' : 'Save'}
          onClick={() => {
            toggleSaved(saveId)
            toast(saved ? 'Removed from saved' : 'Saved to your list')
          }}
          className="pressable p-2"
        >
          <img src={iconSaved} alt="" className={`h-[18px] w-[13px] transition-opacity ${saved ? 'opacity-100' : 'opacity-25'}`} />
        </button>
      </div>
    </div>
  )
}

export function StatCard({ title, icon, iconSize, label }: { title: string; icon: string; iconSize: [number, number]; label: string }) {
  return (
    <div className="flex h-[104px] flex-col items-center rounded-card border border-black/10 pt-[13px] shadow-card">
      <span className="whitespace-nowrap text-[11px] font-bold leading-[13px] text-ink">{title}</span>
      <span className="flex flex-1 items-center justify-center">
        <img src={icon} alt="" style={{ width: iconSize[0], height: iconSize[1] }} />
      </span>
      <span className="pb-[13px] text-[11px] font-medium leading-[13px] text-ink">{label}</span>
    </div>
  )
}

export function BadgesCard({ badges }: { badges: string[] }) {
  return (
    <section className="mt-[10px] rounded-[18px] border border-black/10 px-[12px] pb-[9px] pt-[8px] shadow-card">
      <p className="text-[12px] font-semibold leading-[14px] text-ink">Achievements / Badges</p>
      <div className="mt-[7px] flex items-end gap-[9px]">
        {badges.map((b, i) => (
          <img key={i} src={b} alt="" className="h-[18px] w-auto" />
        ))}
      </div>
    </section>
  )
}

/** Figma: Chart/Minute + Chart/Day – yuvarlak eksenli çubuk grafik */
export function HistoryChart({
  title,
  unit,
  ticks,
  max,
  data,
  color,
  todayColor,
}: {
  title: string
  unit: string
  ticks: number[]
  max: number
  data: { day: number; value: number; isToday: boolean }[]
  color: string
  todayColor: string
}) {
  const plotH = 140
  const today = data.find((d) => d.isToday)
  return (
    <section className="mt-[29px]">
      <div className="flex items-baseline justify-between text-[15px] leading-[18px] text-ink">
        <h2 className="font-semibold">{title}</h2>
        <span className="font-medium">Today {today?.day}</span>
      </div>
      <div className="mt-[12px]">
        <span className="block w-[52px] text-[11px] font-medium text-ink">{unit}</span>
        <div className="flex">
          <div className="flex w-[52px] shrink-0 justify-end pr-[12px]">
            <div className="flex h-[158px] w-[28px] flex-col items-center justify-between rounded-card border border-black/60 py-[7px]">
              {ticks.map((t) => (
                <span key={t} className="text-[11px] font-medium leading-none text-ink">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex h-[158px] flex-1 items-end justify-between px-[6px] pb-[6px]">
            {data.map((d, i) => (
              <motion.span
                key={d.day}
                className="w-[19px] rounded-card"
                style={{ background: d.isToday ? todayColor : color }}
                initial={{ height: 0 }}
                animate={{ height: d.value > 0 ? Math.max(8, (Math.min(d.value, max) / max) * plotH) : 0 }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.32, 0.72, 0, 1] }}
              />
            ))}
          </div>
        </div>
        <div className="mt-[4px] flex items-center">
          <span className="w-[52px] shrink-0 pr-[12px] text-right text-[11px] font-medium text-ink">Day</span>
          <div className="flex h-[22px] flex-1 items-center justify-between rounded-card border border-black/60 px-[6px]">
            {data.map((d) => (
              <span
                key={d.day}
                className={`flex h-[20px] w-[20px] items-center justify-center rounded-full text-[11px] font-medium text-ink ${d.isToday ? 'border border-black/60' : ''}`}
              >
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
