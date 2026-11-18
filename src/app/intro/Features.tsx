/**
 * Figma: Introduction-2, -3, -4 – kaydırılabilir tanıtım sayfaları.
 * Görsel kompozisyon Figma koordinatlarıyla (375×812) yerleştirilir ve ekran genişliğine göre ölçeklenir.
 */
import { motion } from 'motion/react'
import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useNav } from '../../shell/navigation'
import { PrimaryButton } from '../components/PrimaryButton'
import bg2 from '../../assets/intro/bg2.jpg'
import bg3 from '../../assets/intro/bg3.jpg'
import bg4 from '../../assets/intro/bg4.jpg'
import cardWalk from '../../assets/intro/card-walk.svg'
import cardBronze from '../../assets/intro/card-bronze.svg'
import cardLastSip from '../../assets/intro/card-lastsip.svg'
import cardCardio from '../../assets/intro/card-cardio.svg'
import cardProtein from '../../assets/intro/card-protein.svg'
import cardChallenge from '../../assets/intro/card-challenge.svg'

const FW = 375
const FH = 812
/** Figma px → ekran genişliğine oranlı birim */
const vw = (px: number) => `${(px / FW) * 100}cqw`

/** Figma koordinatıyla mutlak yerleşim (art kutusunun içinde) */
function at(x: number, y: number, artTop: number, extra: CSSProperties = {}): CSSProperties {
  return { position: 'absolute', left: vw(x), top: `${((y - artTop) / (FH - artTop)) * 100}%`, ...extra }
}

function Card({ src, x, y, w, artTop }: { src: string; x: number; y: number; w: number; artTop: number }) {
  return <img src={src} alt="" draggable={false} style={at(x, y, artTop, { width: vw(w) })} />
}

function Label({ children, x, y, artTop, white }: { children: ReactNode; x: number; y: number; artTop: number; white?: boolean }) {
  return (
    <span className="whitespace-nowrap font-semibold" style={at(x, y, artTop, { fontSize: vw(26), lineHeight: 1.2, color: white ? '#fff' : '#000' })}>
      {children}
    </span>
  )
}

function ChatBubble({ tag, text, box, tagBox, align }: { tag: string; text: string; box: number[]; tagBox: number[]; align: 'left' | 'right' }) {
  const artTop = 146
  return (
    <>
      <div
        className="flex items-end bg-white"
        style={at(box[0], box[1], artTop, {
          width: vw(box[2]),
          height: `${(box[3] / (FH - artTop)) * 100}%`,
          borderRadius: vw(9),
          border: '0.5px solid rgb(0 0 0 / 0.3)',
          boxShadow: '0 1px 1.5px rgb(0 0 0 / 0.25)',
          padding: `0 ${vw(9)} ${vw(5)}`,
          justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        })}
      >
        <p style={{ fontSize: vw(12), lineHeight: 1.2, textAlign: align }}>{text}</p>
      </div>
      <div
        className="flex items-center justify-center bg-brand text-white"
        style={at(tagBox[0], tagBox[1], artTop, {
          width: vw(tagBox[2]),
          height: `${(tagBox[3] / (FH - artTop)) * 100}%`,
          borderRadius: vw(6),
          border: '0.5px solid rgb(0 0 0 / 0.3)',
          boxShadow: '0 1px 1.5px rgb(0 0 0 / 0.25)',
          fontSize: vw(14),
        })}
      >
        {tag}
      </div>
    </>
  )
}

type Page = { title: string; subtitle: string; bg: string; artTop: number; art: ReactNode }

const PAGES: Page[] = [
  {
    title: 'Track Your Day, Every Step',
    subtitle: 'All your habits and health data, in one place.',
    bg: bg2,
    artTop: 135,
    art: (
      <>
        <Card src={cardWalk} x={51.5} y={299.5} w={101} artTop={135} />
        <Card src={cardBronze} x={262.5} y={412.5} w={86} artTop={135} />
        <Card src={cardLastSip} x={172.5} y={545.5} w={72} artTop={135} />
      </>
    ),
  },
  {
    title: 'Discover, Learn, Grow, Share',
    subtitle: 'Healthy meals, fitness steps, and a community by your side.',
    bg: bg3,
    artTop: 146,
    art: (
      <>
        <Card src={cardCardio} x={32.5} y={322.5} w={86} artTop={146} />
        <Card src={cardProtein} x={265} y={449} w={78} artTop={146} />
        <Card src={cardChallenge} x={32.5} y={565.5} w={86} artTop={146} />
        <Label x={128} y={360} artTop={146}>Stay Active</Label>
        <Label x={78} y={482} artTop={146} white>Find Inspiration</Label>
        <Label x={128} y={603} artTop={146}>Explore Together</Label>
      </>
    ),
  },
  {
    title: 'AI Guidance, Anytime You Need',
    subtitle: 'Your personal coach, always available.',
    bg: bg4,
    artTop: 146,
    art: (
      <>
        <ChatBubble tag="AI" text="Hi, shall we plan your workout?" box={[32, 309, 177, 49]} tagBox={[24, 300, 78, 23]} align="left" />
        <ChatBubble tag="User" text="Create a weekly healthy meal plan for me" box={[149, 388, 178, 49]} tagBox={[260, 379, 78, 23]} align="right" />
      </>
    ),
  },
]

export function Features() {
  const nav = useNav()
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const goTo = (i: number) => {
    const el = scroller.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }
  const next = () => (index < PAGES.length - 1 ? goTo(index + 1) : nav.push('trial'))

  return (
    <div className="relative h-full overflow-hidden bg-[#92A5A9]">
      {/* Kaydırılabilir sayfalar */}
      <div
        ref={scroller}
        className="scroll-x flex h-full"
        onScroll={(e) => {
          const el = e.currentTarget
          setIndex(Math.round(el.scrollLeft / el.clientWidth))
        }}
      >
        {PAGES.map((p) => (
          <section key={p.title} className="relative h-full w-full shrink-0 snap-center snap-always overflow-hidden">
            {/* Arka plan + yüzen kartlar */}
            <div className="absolute inset-x-0 bottom-0" style={{ aspectRatio: `${FW} / ${FH - p.artTop}`, containerType: 'inline-size' }}>
              <img src={p.bg} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover opacity-70" />
              {p.art}
            </div>
            {/* Başlık + açıklama */}
            <div className="relative px-[30px]" style={{ paddingTop: 'calc(var(--safe-top) + 39px)' }}>
              <h1 className="max-w-[315px] text-[25px] font-semibold leading-[30px] text-ink">{p.title}</h1>
              <p className="mt-[26px] max-w-[296px] text-[18px] leading-[21px] text-white">{p.subtitle}</p>
            </div>
          </section>
        ))}
      </div>

      {/* Üst bar: sayfa göstergesi + Skip */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-6 items-center justify-center px-6" style={{ marginTop: 'calc(var(--safe-top) + 2px)' }}>
        <div className="flex gap-[3px]">
          {PAGES.map((p, i) => (
            <motion.span key={p.title} className="h-[2px] w-[15px] rounded-[2px]" animate={{ backgroundColor: i === index ? '#0BB791' : '#FCFCFC' }} transition={{ duration: 0.25 }} />
          ))}
        </div>
        <button onClick={() => nav.push('trial')} className="pressable pointer-events-auto absolute right-6 -my-2 py-2 text-[13px] font-light text-white">
          Skip
        </button>
      </div>

      {/* Continue */}
      <div className="absolute inset-x-6" style={{ bottom: 'calc(max(var(--safe-bottom), 20px) + 14px)' }}>
        <PrimaryButton tone="mint" onClick={next}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  )
}
