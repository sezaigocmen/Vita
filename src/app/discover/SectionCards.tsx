/** Discover kartları ve davranışları (ana ekran ve "See All" listesinde ortak) */
import { useState } from 'react'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { CardButton, ProgressBar, SmallCard } from '../components/Cards'
import { PrimaryButton } from '../components/PrimaryButton'
import { useVita } from '../store'
import { COMMUNITY, MIND, RECIPES, WORKOUTS } from '../data/discover'

export type SectionId = 'workouts' | 'recipes' | 'mind' | 'community'

export const SECTION_TITLES: Record<SectionId, string> = {
  workouts: 'Workouts for You',
  recipes: 'Healthy Recipes',
  mind: 'Mind & Meditation',
  community: 'Community',
}

/** Figma: Component/discover/selected – ilerleme çubuğu + koyu yeşil "Continue" */
function ContinueFooter({ pct, onClick }: { pct: number; onClick: () => void }) {
  const done = pct >= 100
  return (
    <>
      <ProgressBar pct={pct} className="mx-auto mb-[7px] w-[56px]" />
      <button onClick={onClick} className="pressable h-[26px] w-full rounded-b-card bg-brand text-[12px] font-medium text-white shadow-btn">
        {done ? 'Done ✓' : 'Continue'}
      </button>
    </>
  )
}

export function SectionCards({ section }: { section: SectionId }) {
  const nav = useNav()
  const workouts = useVita((s) => s.workouts)
  const setWorkout = useVita((s) => s.setWorkout)
  const accepted = useVita((s) => s.accepted)
  const toggleAccept = useVita((s) => s.toggleAccept)
  const [playing, setPlaying] = useState<string | null>(null)

  if (section === 'workouts')
    return (
      <>
        {WORKOUTS.map((w) => {
          const pct = workouts[w.id]
          const started = pct !== undefined
          return (
            <SmallCard
              key={w.id}
              title={w.title}
              icon={w.icon}
              text={w.text}
              footer={
                started ? (
                  <ContinueFooter
                    pct={pct}
                    onClick={() => {
                      if (pct >= 100) return toast(`${w.title} completed this week 💪`)
                      const next = Math.min(100, pct + 15)
                      setWorkout(w.id, next)
                      toast(next >= 100 ? `🎉 ${w.title} program complete!` : `${w.title} session done · ${next}%`)
                    }}
                  />
                ) : (
                  <CardButton
                    label={w.cta}
                    onClick={() => {
                      setWorkout(w.id, 10)
                      toast(`${w.title} added to your plan`)
                    }}
                  />
                )
              }
            />
          )
        })}
      </>
    )

  if (section === 'recipes')
    return (
      <>
        {RECIPES.map((r) => (
          <button key={r.id} className="pressable shrink-0 snap-start text-left" onClick={() => nav.push('recipe', { id: r.id })}>
            <SmallCard title={r.title} icon={r.icon} text={r.card} footer={<span className="flex h-[26px] w-full items-center justify-center rounded-b-card bg-mint text-[12px] font-medium text-white shadow-btn">{r.cta}</span>} />
          </button>
        ))}
      </>
    )

  if (section === 'mind')
    return (
      <>
        {MIND.map((m) => {
          const on = playing === m.id
          return (
            <SmallCard
              key={m.id}
              title={m.title}
              icon={m.icon}
              text={m.text}
              footer={
                <CardButton
                  label={on ? 'Playing ❚❚' : m.cta}
                  active={on}
                  onClick={() => {
                    setPlaying(on ? null : m.id)
                    toast(on ? `${m.title} paused` : `▶ ${m.title} · ${m.text.split(' •')[0]} session`)
                  }}
                />
              }
            />
          )
        })}
      </>
    )

  return (
    <>
      {COMMUNITY.map((c) => {
        const joined = accepted.includes(c.id)
        const onClick = () => {
          if (c.id === 'yoga-flow') {
            toggleAccept(c.id)
            toast(joined ? 'You left the challenge' : '🧘 You joined Daily Yoga Flow!')
          } else if (c.id === 'lana') nav.push('recipe', { id: 'smoothie', sharedBy: 'Lana' })
          else if (c.story)
            nav.openSheet((close) => (
              <div className="flex flex-col gap-3 px-6 pb-6 pt-1">
                <img src={c.icon} alt="" className="h-10 w-10" />
                <h2 className="text-title3 font-semibold">{c.story!.title}</h2>
                <p className="text-[15px] leading-[21px] text-black/70">{c.story!.body}</p>
                <PrimaryButton size="lg" tone="mint" className="mt-2" onClick={close}>
                  {c.id === 'tips' ? 'I’ll try it' : 'Nice!'}
                </PrimaryButton>
              </div>
            ))
        }
        return (
          <SmallCard
            key={c.id}
            title={c.title}
            icon={c.icon}
            text={c.text}
            footer={<CardButton label={c.id === 'yoga-flow' && joined ? 'Joined ✓' : c.cta} active={c.id === 'yoga-flow' && joined} onClick={onClick} />}
          />
        )
      })}
    </>
  )
}
