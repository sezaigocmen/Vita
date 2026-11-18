/** Figma: AI-1 – AI Chat / Chat History / Saved Suggest kartları */
import { useNav } from '../../shell/navigation'
import { ScreenLayout } from '../components/ScreenLayout'
import { useVita } from '../store'
import imgChat from '../../assets/ai/img-chat.svg'
import imgHistory from '../../assets/ai/img-history.svg'
import imgSaved from '../../assets/ai/img-saved.svg'

export function AiHome() {
  const nav = useNav()
  const chats = useVita((s) => s.chats.length)
  const saved = useVita((s) => s.savedTips.length + s.saved.length)

  const cards = [
    { title: 'AI Chat', text: 'Ask me anything about your health, habits, or routines.', cta: 'Start Chat', img: imgChat, size: [46, 34], go: () => nav.push('ai-chat', {}) },
    { title: 'Chat History', text: `Quickly revisit your previous conversations and tips.${chats ? ` · ${chats} saved` : ''}`, cta: 'View', img: imgHistory, size: [38, 34], go: () => nav.push('ai-history') },
    { title: 'Saved Suggest', text: `Access the recommendations you loved and want to try again.${saved ? ` · ${saved} items` : ''}`, cta: 'View', img: imgSaved, size: [37, 34], go: () => nav.push('ai-saved') },
  ]

  return (
    <ScreenLayout title="AI">
      <div className="flex flex-col gap-[25px] px-6 pt-[37px]">
        {cards.map((c) => (
          <button
            key={c.title}
            onClick={c.go}
            className="pressable relative flex h-[87px] w-full items-start justify-between rounded-card border border-black/10 bg-bg px-[14px] pt-[13px] text-left shadow-card"
          >
            <span className="flex flex-col">
              <span className="text-title3 font-semibold text-ink">{c.title}</span>
              <span className="mt-[8px] max-w-[190px] text-[12px] leading-[14px] text-ink">{c.text}</span>
            </span>
            <span className="flex w-[90px] shrink-0 flex-col items-center">
              <span className="flex h-[22px] w-[90px] items-center justify-center rounded-chip bg-mint text-[14px] font-medium text-white shadow-btn">{c.cta}</span>
              <img src={c.img} alt="" className="mt-[5px]" style={{ width: c.size[0], height: c.size[1] }} />
            </span>
          </button>
        ))}
      </div>
    </ScreenLayout>
  )
}
