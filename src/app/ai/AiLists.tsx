/** Chat History ve Saved Suggest listeleri (Figma'da AI-1 kartlarından açılır; ekran tasarımı Vita diliyle) */
import { motion } from 'motion/react'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { BackButton, ScreenLayout } from '../components/ScreenLayout'
import { PrimaryButton } from '../components/PrimaryButton'
import { useVita } from '../store'
import { recipeById } from '../data/discover'
import imgHistory from '../../assets/ai/img-history.svg'
import imgSaved from '../../assets/ai/img-saved.svg'
import iconAi from '../../assets/home/icon-ai.svg'

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

function Empty({ img, title, text, cta, onClick }: { img: string; title: string; text: string; cta: string; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center px-10 pt-16 text-center">
      <img src={img} alt="" className="h-[60px] w-auto opacity-90" />
      <h2 className="mt-4 text-title3 font-semibold">{title}</h2>
      <p className="mt-2 text-[14px] leading-[19px] text-black/55">{text}</p>
      <PrimaryButton size="lg" className="mt-6 max-w-[220px]" onClick={onClick}>
        {cta}
      </PrimaryButton>
    </div>
  )
}

export function ChatHistory() {
  const nav = useNav()
  const chats = useVita((s) => s.chats)
  const deleteChat = useVita((s) => s.deleteChat)
  return (
    <ScreenLayout title="AI">
      <div className="px-6 pt-[12px]">
        <BackButton onClick={nav.pop} />
        <h1 className="mt-[2px] text-title2 font-semibold text-ink">Chat History</h1>
      </div>
      {chats.length === 0 ? (
        <Empty img={imgHistory} title="No saved chats yet" text="When you close a chat, tap “Yes” to save it here." cta="Start a chat" onClick={() => nav.push('ai-chat', {})} />
      ) : (
        <ul className="mt-[14px] flex flex-col gap-[10px] px-6 pb-6">
          {chats.map((c) => {
            const lastAi = [...c.messages].reverse().find((m) => m.role === 'ai')
            return (
              <motion.li key={c.id} layout exit={{ opacity: 0 }} className="relative">
                <button
                  onClick={() => nav.push('ai-chat', { chatId: c.id })}
                  className="pressable flex w-full flex-col rounded-card border border-black/10 bg-bg px-[16px] py-[12px] pr-[44px] text-left shadow-card"
                >
                  <span className="text-[15px] font-semibold text-ink">{c.title}</span>
                  <span className="mt-[2px] line-clamp-2 text-[12px] leading-[15px] text-black/55">{lastAi?.text}</span>
                  <span className="mt-[6px] text-[11px] text-black/40">{fmtDate(c.date)}</span>
                </button>
                <button
                  aria-label="Delete chat"
                  onClick={() => {
                    deleteChat(c.id)
                    toast('Chat deleted')
                  }}
                  className="pressable absolute right-[10px] top-[10px] p-2"
                >
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden>
                    <path d="M1 3.5h12M5 3.5V2h4v1.5M2.5 3.5l.8 10.5h7.4l.8-10.5" stroke="#000" strokeOpacity=".5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </motion.li>
            )
          })}
        </ul>
      )}
    </ScreenLayout>
  )
}

export function SavedSuggest() {
  const nav = useNav()
  const tips = useVita((s) => s.savedTips)
  const saved = useVita((s) => s.saved)
  const toggleTip = useVita((s) => s.toggleTip)

  const items = saved.map((id) => {
    if (id === 'water') return { id, title: 'Drink Water', sub: 'Hydration guide', go: () => nav.push('water-detail') }
    if (id === 'meditation') return { id, title: 'Meditation', sub: 'Mind & focus', go: () => nav.push('meditation') }
    const r = recipeById(id.replace('recipe:', ''))
    return { id, title: r.title, sub: `Recipe · ${r.card}`, go: () => nav.push('recipe', { id: r.id }) }
  })

  return (
    <ScreenLayout title="AI">
      <div className="px-6 pt-[12px]">
        <BackButton onClick={nav.pop} />
        <h1 className="mt-[2px] text-title2 font-semibold text-ink">Saved Suggest</h1>
      </div>
      {tips.length === 0 && items.length === 0 ? (
        <Empty
          img={imgSaved}
          title="Nothing saved yet"
          text="Save plans from your AI coach, or bookmark recipes and guides across Vita."
          cta="Ask your coach"
          onClick={() => nav.push('ai-chat', {})}
        />
      ) : (
        <div className="px-6 pb-6">
          {tips.length > 0 && (
            <>
              <h2 className="mt-[16px] text-[16px] font-semibold text-ink">From your coach</h2>
              <ul className="mt-[8px] flex flex-col gap-[10px]">
                {tips.map((t) => (
                  <li key={t.id} className="relative flex gap-[9px] rounded-card border border-black/10 bg-bg px-[14px] py-[12px] pr-[40px] shadow-card">
                    <img src={iconAi} alt="" className="mt-[1px] h-[18px] w-[20px] shrink-0" />
                    <p className="whitespace-pre-line text-[13px] leading-[17px] text-ink">{t.text}</p>
                    <button
                      aria-label="Remove"
                      onClick={() => {
                        toggleTip(t)
                        toast('Removed from Saved Suggest')
                      }}
                      className="pressable absolute right-[8px] top-[8px] p-2 text-[16px] leading-none text-black/40"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {items.length > 0 && (
            <>
              <h2 className="mt-[20px] text-[16px] font-semibold text-ink">Saved in Vita</h2>
              <ul className="mt-[8px] flex flex-col gap-[10px]">
                {items.map((it) => (
                  <li key={it.id}>
                    <button onClick={it.go} className="pressable flex w-full items-center justify-between rounded-card border border-black/10 bg-bg px-[16px] py-[12px] text-left shadow-card">
                      <span>
                        <span className="block text-[15px] font-semibold text-ink">{it.title}</span>
                        <span className="block text-[12px] text-black/50">{it.sub}</span>
                      </span>
                      <span className="text-[18px] text-black/30">›</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </ScreenLayout>
  )
}
