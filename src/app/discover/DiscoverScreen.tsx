/** Figma: Discover-1 / Discover-2 */
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { ScreenLayout } from '../components/ScreenLayout'
import { SectionTitle } from '../components/Cards'
import { useVita } from '../store'
import { AI_SUGGESTION } from '../data/home'
import { HIGHLIGHTS } from '../data/discover'
import { SECTION_TITLES, SectionCards, type SectionId } from './SectionCards'
import iconAi from '../../assets/home/icon-ai.svg'

const SECTIONS: SectionId[] = ['workouts', 'recipes', 'mind', 'community']

export function DiscoverScreen() {
  const nav = useNav()
  const goal = useVita((s) => s.answers.goal?.[0] ?? 'fitter')

  return (
    <ScreenLayout title="Discover">
      <p className="px-6 pt-[13px] text-[13px] font-semibold leading-[16px] text-ink">Highlights</p>

      {/* Highlights slaytı */}
      <div className="scroll-x mt-[4px] flex gap-[6px] px-6 py-[3px]" style={{ scrollPaddingInline: 24 }}>
        {HIGHLIGHTS.map((h) => (
          <div
            key={h.id}
            className="relative h-[132px] w-full shrink-0 snap-center overflow-hidden rounded-card border border-black/10 shadow-card"
          >
            <img src={h.img} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_30%,rgb(0_0_0/0.35))]" />
            <div className="absolute right-[12px] top-[12px] flex h-[calc(100%-24px)] flex-col items-end justify-between text-right text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.35)]">
              <h3 className="whitespace-pre-line text-[20px] font-semibold leading-[24px]">{h.title}</h3>
              <p className="max-w-[180px] text-[12px] font-medium leading-[15px]">{h.text}</p>
            </div>
            <button
              onClick={() => toast(`▶ ${h.title.replace('\n', ' ')} started`)}
              className="pressable absolute bottom-[12px] left-[30px] h-[24px] rounded-chip bg-mint px-[14px] text-[13px] font-medium text-white shadow-btn"
            >
              Start Now
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => nav.setTab('ai')} className="pressable mt-[26px] flex w-full items-start gap-[9px] px-6 text-left">
        <img src={iconAi} alt="" className="mt-[1px] h-[18px] w-[20px] shrink-0" />
        <span className="text-[12px] leading-[15px] text-ink">{AI_SUGGESTION[goal] ?? AI_SUGGESTION.fitter}</span>
      </button>

      {SECTIONS.map((s) => (
        <section key={s} className="mt-[24px]">
          <SectionTitle title={SECTION_TITLES[s]} onSeeAll={() => nav.push('discover-list', { section: s })} />
          <div className="scroll-x mt-[8px] flex gap-[6px] px-6 py-[3px]" style={{ scrollPaddingInline: 24 }}>
            <SectionCards section={s} />
          </div>
        </section>
      ))}
      <div className="h-6" />
    </ScreenLayout>
  )
}
