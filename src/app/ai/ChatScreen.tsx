/** Figma: AI-2, AI-3, AI-3 (Save your chat?) – AI koç sohbeti (hazır cevaplarla) */
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNav, type ScreenProps } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { Dialog } from '../../shell/Dialog'
import { Header } from '../components/Header'
import { useDayLog, useVita } from '../store'
import { dateKey, startOfToday } from '../data/daily'
import { chatTitle, greeting, reply, SUGGESTIONS, userMsg, type ChatMsg, type CoachAction, type FlowState } from '../data/coach'
import iconAi from '../../assets/home/icon-ai.svg'
import iconClose from '../../assets/ai/icon-close.svg'
import iconEdit from '../../assets/ai/icon-edit.svg'
import iconOptions from '../../assets/ai/icon-options.svg'
import iconCamera from '../../assets/ai/icon-camera.svg'
import btnMic from '../../assets/ai/btn-mic.svg'
import userAvatar from '../../assets/ai/user-avatar.svg'

type Pending = 'close' | 'new' | null

/** iOS klavyesi açılınca yazı alanını klavyenin üstünde tutar */
function useKeyboardInset() {
  const [inset, setInset] = useState(0)
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () => setInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop))
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])
  return inset
}

export function ChatScreen({ params }: ScreenProps<{ chatId?: string }>) {
  const nav = useNav()
  const name = useVita((s) => s.user.name)
  const goal = useVita((s) => s.answers.goal?.[0] ?? 'fitter')
  const savedChat = useVita((s) => s.chats.find((c) => c.id === params.chatId))
  const saveChat = useVita((s) => s.saveChat)
  const toggleTip = useVita((s) => s.toggleTip)
  const savedTips = useVita((s) => s.savedTips)
  const addMeditation = useVita((s) => s.addMeditation)
  const addGlasses = useVita((s) => s.addGlasses)
  const setWalkActive = useVita((s) => s.setWalkActive)
  const todayKey = useMemo(() => dateKey(startOfToday()), [])
  const log = useDayLog(todayKey)

  const [chatId, setChatId] = useState(params.chatId ?? `chat-${Date.now()}`)
  const [messages, setMessages] = useState<ChatMsg[]>(() => savedChat?.messages ?? [greeting(name)])
  const [flow, setFlow] = useState<FlowState>(null)
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const [pending, setPending] = useState<Pending>(null)
  const [savedVersion, setSavedVersion] = useState(savedChat ? savedChat.messages.length : 1)
  const scroller = useRef<HTMLDivElement>(null)
  const kb = useKeyboardInset()

  const hasUserMsgs = messages.some((m) => m.role === 'user')
  const unsaved = hasUserMsgs && messages.length !== savedVersion

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, kb])

  const send = (input: string, chip = false) => {
    const t = input.trim()
    if (!t || typing) return
    setText('')
    setMessages((m) => [...m, userMsg(t, chip)])
    setTyping(true)
    const ctx = { name, goal, walkKm: log.walkKm, glasses: log.glasses, sleepMin: log.sleepMin, proteinG: log.proteinG }
    const { msg, state } = reply(t, flow, ctx)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, msg])
      setFlow(state)
    }, 650 + Math.min(900, msg.text.length * 6))
  }

  const runAction = (a: CoachAction, msg: ChatMsg) => {
    if (a.kind === 'recipe') nav.push('recipe', { id: a.id })
    else if (a.kind === 'meditation') {
      addMeditation(todayKey, a.minutes, true)
      toast(`🧘 ${a.minutes}-min session logged to Progress`)
    } else if (a.kind === 'water') {
      addGlasses(todayKey, 1)
      toast('+400 ml water 💧')
    } else if (a.kind === 'walk') {
      setWalkActive(true)
      toast('🚶 Walk started — track it on Home')
    } else if (a.kind === 'saveTip') {
      const on = savedTips.some((t) => t.id === msg.id)
      toggleTip({ id: msg.id, text: msg.text, date: new Date().toISOString() })
      toast(on ? 'Removed from Saved Suggest' : '⭐ Saved to Saved Suggest')
    }
  }

  const doSave = () => {
    saveChat({ id: chatId, title: chatTitle(messages), date: new Date().toISOString(), messages })
    setSavedVersion(messages.length)
  }
  const reset = () => {
    setChatId(`chat-${Date.now()}`)
    setMessages([greeting(name)])
    setFlow(null)
    setSavedVersion(1)
  }
  const finish = (save: boolean) => {
    if (save) {
      doSave()
      toast('Chat saved to Chat History')
    }
    const p = pending
    setPending(null)
    if (p === 'close') nav.pop()
    else reset()
  }
  const requestLeave = (what: Exclude<Pending, null>) => {
    if (unsaved) setPending(what)
    else if (what === 'close') nav.pop()
    else reset()
  }

  const openOptions = () =>
    nav.openSheet((close) => (
      <div className="flex flex-col gap-2 px-6 pb-6 pt-1">
        <SheetRow
          label="Save chat"
          disabled={!hasUserMsgs}
          onClick={() => {
            doSave()
            toast('Chat saved to Chat History')
            close()
          }}
        />
        <SheetRow
          label="New chat"
          onClick={() => {
            close()
            requestLeave('new')
          }}
        />
        <p className="mt-2 text-[12px] leading-[16px] text-black/45">
          Vita’s coach in this demo uses prepared answers — no data leaves your device. It doesn’t give medical advice.
        </p>
      </div>
    ))

  const last = messages[messages.length - 1]

  return (
    <div className="relative flex h-full flex-col bg-bg">
      <Header title="AI" />

      {/* Araç çubuğu: kapat · yeni sohbet · seçenekler */}
      <div className="flex h-[46px] shrink-0 items-center justify-between px-[22px]">
        <button aria-label="Close chat" onClick={() => requestLeave('close')} className="pressable p-2">
          <img src={iconClose} alt="" className="h-[15px] w-[15px]" />
        </button>
        <div className="flex items-center gap-[6px]">
          <button aria-label="New chat" onClick={() => requestLeave('new')} className="pressable p-2">
            <img src={iconEdit} alt="" className="h-[19px] w-[19px]" />
          </button>
          <button aria-label="Options" onClick={openOptions} className="pressable p-2">
            <img src={iconOptions} alt="" className="h-[4px] w-[14px]" />
          </button>
        </div>
      </div>

      {/* Mesajlar */}
      <div ref={scroller} className="scroll-y min-h-0 flex-1 px-6 pb-4">
        {messages.map((m, i) => (
          <Message key={m.id} m={m} isLast={m === last} onReply={(r) => send(r)} onAction={runAction} saved={savedTips.some((t) => t.id === m.id)}>
            {i === 0 && m.id === 'hello' && (
              <Chips items={SUGGESTIONS} onPick={(s) => send(s, true)} disabled={typing} />
            )}
          </Message>
        ))}
        <AnimatePresence>{typing && <Typing />}</AnimatePresence>
      </div>

      {/* Yazı alanı (Figma: Btn/Text your message) */}
      <form
        className="shrink-0 bg-header px-[17px] pt-[14px]"
        style={{ paddingBottom: kb > 0 ? 10 : 'calc(max(var(--safe-bottom), 10px) + 13px)', marginBottom: kb }}
        onSubmit={(e) => {
          e.preventDefault()
          send(text)
        }}
      >
        <div className="flex items-center gap-[6px]">
          <div className="flex h-[38px] flex-1 items-center gap-[6px] rounded-card border border-black/10 bg-[#FEFEFE] pl-[5px] pr-[10px] shadow-card">
            <button
              type="button"
              aria-label="Suggestions"
              onClick={() =>
                nav.openSheet((close) => (
                  <div className="px-6 pb-6 pt-1">
                    <h2 className="mb-3 text-title3 font-semibold">Try asking about</h2>
                    <Chips
                      items={SUGGESTIONS}
                      onPick={(s) => {
                        close()
                        send(s, true)
                      }}
                    />
                  </div>
                ))
              }
              className="pressable flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full border border-black/10 bg-header text-[18px] leading-none text-ink shadow-card"
            >
              +
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Text your message"
              enterKeyHint="send"
              className="min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink/60"
            />
            <button type="button" aria-label="Photo" onClick={() => toast('📷 Photo meal logging — coming soon')} className="pressable shrink-0">
              <img src={iconCamera} alt="" className="h-[15px] w-[17px]" />
            </button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {text.trim() ? (
              <motion.button
                key="send"
                type="submit"
                aria-label="Send"
                className="pressable flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-brand shadow-card"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                  <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                type="button"
                aria-label="Voice"
                onClick={() => toast('🎙️ Voice input isn’t available in this demo')}
                className="pressable shrink-0"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <img src={btnMic} alt="" className="h-[36px] w-[36px]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>

      <Dialog
        open={pending !== null}
        title="Save your chat?"
        message="You can access it later from your saved chats."
        onClose={() => setPending(null)}
        buttons={[
          { label: 'Yes', tone: 'primary', onClick: () => finish(true) },
          { label: 'No', tone: 'secondary', onClick: () => finish(false) },
        ]}
      />
    </div>
  )
}

function Message({
  m,
  isLast,
  onReply,
  onAction,
  saved,
  children,
}: {
  m: ChatMsg
  isLast: boolean
  onReply: (r: string) => void
  onAction: (a: CoachAction, m: ChatMsg) => void
  saved: boolean
  children?: React.ReactNode
}) {
  if (m.role === 'user') {
    if (m.chip)
      return (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-[18px] pl-[29px]">
          <span className="inline-flex h-[26px] items-center rounded-full border border-black/10 bg-header px-[12px] text-[12px] font-semibold text-ink shadow-card">{m.text}</span>
        </motion.div>
      )
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-[22px] flex items-end justify-end gap-[9px] pl-[40px]">
        <p className="text-right text-[14px] leading-[18px] text-ink">{m.text}</p>
        <img src={userAvatar} alt="" className="h-[22px] w-[19px] shrink-0" />
      </motion.div>
    )
  }
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-[22px] flex gap-[9px] first:mt-[14px]">
      <img src={iconAi} alt="" className="mt-[1px] h-[18px] w-[20px] shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="whitespace-pre-line text-[14px] leading-[19px] text-ink">{m.text}</p>
        {children}
        {m.action && (
          <button
            onClick={() => onAction(m.action!, m)}
            className={`pressable mt-[10px] h-[28px] rounded-chip px-[14px] text-[13px] font-medium shadow-btn ${
              m.action.kind === 'saveTip' && saved ? 'bg-header text-ink' : 'bg-brand text-white'
            }`}
          >
            {m.action.kind === 'saveTip' && saved ? 'Saved ✓' : m.action.label}
          </button>
        )}
        {isLast && m.replies && <Chips items={m.replies} onPick={onReply} />}
      </div>
    </motion.div>
  )
}

function Chips({ items, onPick, disabled }: { items: string[]; onPick: (s: string) => void; disabled?: boolean }) {
  return (
    <div className="mt-[10px] flex flex-wrap gap-[7px]">
      {items.map((s) => (
        <button
          key={s}
          disabled={disabled}
          onClick={() => onPick(s)}
          className="pressable h-[28px] rounded-full border border-black/20 bg-bg px-[11px] text-[12px] font-semibold text-ink shadow-card disabled:opacity-50"
        >
          {s}
        </button>
      ))}
    </div>
  )
}

function Typing() {
  return (
    <motion.div className="mt-[22px] flex items-center gap-[9px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <img src={iconAi} alt="" className="h-[18px] w-[20px]" />
      <span className="flex gap-[4px]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-[6px] w-[6px] rounded-full bg-ink/40"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
    </motion.div>
  )
}

function SheetRow({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="pressable h-[50px] w-full rounded-[16px] border border-black/10 bg-bg text-left text-[16px] font-medium text-ink shadow-card disabled:opacity-40"
      style={{ paddingInline: 18 }}
    >
      {label}
    </button>
  )
}
