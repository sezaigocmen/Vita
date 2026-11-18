/** Home ekranının içerikleri (Figma metinleri + aynı tonda birkaç ek) */
import achBronze from '../../assets/home/ach-bronze.svg'
import achSleep from '../../assets/home/ach-sleep.svg'
import achLastSip from '../../assets/home/ach-lastsip.svg'
import achChef from '../../assets/home/ach-chef.svg'
import chStep from '../../assets/home/ch-step.svg'
import chBreathe from '../../assets/home/ch-breathe.svg'
import chHydrate from '../../assets/home/ch-hydrate.svg'
import chMind from '../../assets/home/ch-mind.svg'

export const QUOTES = [
  'The time you take for yourself today lays the foundation for tomorrow’s success.',
  'With every breath, you’re gathering your energy — did you notice how far you’ve come?',
  'Small steps every day add up to big changes.',
  'Rest is part of the plan, not a break from it.',
  'Nourish your body, calm your mind, and the rest will follow.',
]

export const TIPS = [
  'Drink a glass of water 30 minutes before exercise to improve performance.',
  'A 10-minute walk after meals helps keep your energy steady.',
  'Dim your screens an hour before bed for deeper sleep.',
  'Add a palm-sized portion of protein to every meal.',
  'Try box breathing: in 4, hold 4, out 4, hold 4.',
]

/** Onboarding'deki ana hedefe göre AI önerisi */
export const AI_SUGGESTION: Record<string, string> = {
  fitter: 'Based on your goals, I suggest a 15-min stretching session this morning.',
  eat: 'Based on your goals, I suggest a protein-rich breakfast to start your day.',
  stress: 'Based on your goals, I suggest a 5-min breathing break before lunch.',
  sleep: 'Based on your goals, I suggest winding down 30 minutes earlier tonight.',
}

export type Achievement = {
  id: string
  title: string
  text: string
  icon: string
  /** Kazanıldıysa "Claim" butonu, değilse ilerleme çubuğu */
  progress?: { value: string; pct: number }
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'bronze', title: 'Bronze Walker', text: '3-day streak', icon: achBronze },
  { id: 'sleep', title: 'Sleep Guardian', text: '7 nights of 8 hours!', icon: achSleep },
  { id: 'lastsip', title: 'Last Sip', text: '500 ml to hit water goal', icon: achLastSip, progress: { value: '410 ml', pct: 92 } },
  { id: 'chef', title: 'Chef in Progress', text: '2 meals away from your badge', icon: achChef, progress: { value: '3', pct: 80 } },
]

export type Challenge = { id: string; title: string; text: string; icon: string }

export const CHALLENGES: Challenge[] = [
  { id: 'step', title: 'Step it Up', text: '+2,000 steps today', icon: chStep },
  { id: 'breathe', title: 'Breathe In', text: '5-min meditation', icon: chBreathe },
  { id: 'hydrate', title: 'Hydrate Now', text: '+500 ml in 30 min', icon: chHydrate },
  { id: 'mind', title: 'Mind Clear', text: 'No phone 1 hr', icon: chMind },
]
