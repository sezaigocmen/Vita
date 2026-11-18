/** Figma: Onboarding-2 … -6 – tek soru ekranı (seçenek kartları + Next/Done) */
import { motion } from 'motion/react'
import { useNav, type ScreenProps } from '../../shell/navigation'
import { PrimaryButton } from '../components/PrimaryButton'
import { useVita } from '../store'
import { QUESTIONS } from './questions'

export function QuestionScreen({ params }: ScreenProps<{ index: number }>) {
  const nav = useNav()
  const q = QUESTIONS[params.index]
  const isLast = params.index === QUESTIONS.length - 1
  const selected = useVita((s) => s.answers[q.id]) ?? []
  const setAnswer = useVita((s) => s.setAnswer)

  const toggle = (id: string) => {
    if (q.multi) setAnswer(q.id, selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id])
    else setAnswer(q.id, [id])
  }
  const next = () => (isLast ? nav.push('ob-analyzing') : nav.push('ob-question', { index: params.index + 1 }))
  const hasAnswer = selected.length > 0

  return (
    <div className="flex h-full flex-col bg-bg px-6" style={{ paddingTop: 'calc(var(--safe-top) + 2px)', paddingBottom: 'calc(max(var(--safe-bottom), 20px) + 14px)' }}>
      {/* Üst bar: geri · ilerleme · Skip */}
      <div className="relative flex h-6 items-center justify-between">
        <button aria-label="Back" onClick={nav.pop} className="pressable -m-2 p-2">
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none" aria-hidden>
            <path d="M8.5 1.5 1.5 8.5l7 7" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="absolute left-1/2 flex -translate-x-1/2 gap-[3px]">
          {QUESTIONS.map((_, i) => (
            <span key={i} className={`h-[2px] w-[15px] rounded-[2px] ${i === params.index ? 'bg-brand' : 'bg-line'}`} />
          ))}
        </div>
        <button onClick={() => nav.push('ob-analyzing')} className="pressable -my-2 py-2 text-[13px] font-light text-ink">
          Skip
        </button>
      </div>

      <h1 className="mt-[23px] min-h-[53px] text-title3 font-semibold text-ink">{q.title}</h1>
      {q.multi && <p className="-mt-3 mb-1 text-footnote text-black/50">Select all that apply</p>}

      <ul className="mt-4 flex flex-col gap-[10px]">
        {q.options.map((o, i) => {
          const on = selected.includes(o.id)
          return (
            <motion.li key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 + i * 0.05 }}>
              <button
                onClick={() => toggle(o.id)}
                aria-pressed={on}
                className={`pressable flex h-[55px] w-full items-center rounded-card border bg-bg text-left shadow-card transition-colors ${
                  on ? 'border-brand/60 bg-brand/[0.06]' : 'border-black/10'
                }`}
              >
                <span className="flex w-[74px] shrink-0 items-center justify-center">
                  <img src={o.icon} alt="" className="max-h-[30px] max-w-[36px]" />
                </span>
                <span className={`text-[15px] leading-[18px] transition-colors ${on ? 'font-medium text-brand' : 'text-ink'}`}>{o.label}</span>
              </button>
            </motion.li>
          )
        })}
      </ul>

      <div className="flex-1" />
      <PrimaryButton tone={hasAnswer ? 'brand' : 'mint'} disabled={!hasAnswer} onClick={next} className="disabled:active:scale-100 disabled:active:opacity-100">
        {isLast ? 'Done!' : 'Next'}
      </PrimaryButton>
    </div>
  )
}
