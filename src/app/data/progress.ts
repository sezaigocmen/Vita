/** Progress verisi: skorlar Home'daki günlük kayıtlardan hesaplanır, geri kalanı demo değerleri */
import { addDays, dateKey, progressOf, seedLog, startOfToday, type DayLog } from './daily'

/* ── Meditasyon ── */
export type MedLog = { min: number; sessions: number }
export const MED_WEEKLY_GOAL = 150

function rand(key: string, salt: number) {
  let h = 2166136261 ^ salt
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619)
  return ((h >>> 0) % 1000) / 1000
}

export function seedMed(key: string): MedLog {
  const today = startOfToday()
  if (key === dateKey(today)) return { min: 10, sessions: 1 }
  // Figma'daki değerlere yakın bir hafta: ~75 dk, ~12 oturum, 5 günlük seri
  const daysAgo = Math.round((today.getTime() - new Date(key + 'T00:00:00').getTime()) / 86400000)
  if (daysAgo === 5 || (daysAgo > 6 && rand(key, 9) < 0.3)) return { min: 0, sessions: 0 }
  const min = 5 + Math.round(rand(key, 10) * 3) * 5
  return { min, sessions: min >= 15 ? 2 : 1 }
}

export function medStats(med: Record<string, Partial<MedLog>>) {
  const today = startOfToday()
  const days = Array.from({ length: 7 }, (_, i) => {
    const k = dateKey(addDays(today, i - 6))
    return { ...seedMed(k), ...med[k] }
  })
  const minutes = days.reduce((a, d) => a + d.min, 0)
  const sessions = days.reduce((a, d) => a + d.sessions, 0)
  let streak = 0
  for (let i = 0; i < 60; i++) {
    const k = dateKey(addDays(today, -i))
    if ({ ...seedMed(k), ...med[k] }.min > 0) streak++
    else if (i > 0) break
  }
  return { minutes, sessions, streak, pct: Math.min(100, Math.round((minutes / MED_WEEKLY_GOAL) * 100)) }
}

/* ── Genel sağlık skoru ── */
export type Range = 'Y' | 'D' | 'W' | 'M' | '3M'
export const RANGES: Range[] = ['Y', 'D', 'W', 'M', '3M']

const dayLog = (logs: Record<string, Partial<DayLog>>, k: string) => ({ ...seedLog(k), ...logs[k] })

/** Son n günün (bugün dahil, offset kadar geriden) ortalama metrik yüzdesi */
export function avgProgress(logs: Record<string, Partial<DayLog>>, days: number, offset = 0, metric: Metric = 'overall') {
  const today = startOfToday()
  let sum = 0
  for (let i = 0; i < days; i++) sum += progressOf(dayLog(logs, dateKey(addDays(today, -i - offset))))[metric]
  return Math.round(sum / days)
}

export function healthScore(logs: Record<string, Partial<DayLog>>, range: Range) {
  if (range === 'D') return avgProgress(logs, 1)
  if (range === 'W') return Math.min(99, avgProgress(logs, 7) + 14)
  if (range === 'M') return Math.min(99, avgProgress(logs, 30) + 10)
  if (range === '3M') return 72
  return 78
}

export const statusOf = (v: number) => (v >= 90 ? 'Optimal' : v >= 80 ? 'Good' : v >= 70 ? 'Balanced' : v >= 55 ? 'Healthy' : 'Low')
export const statusColor = (v: number) => (v >= 80 ? '#0BB791' : v >= 55 ? '#F1DCB4' : '#F6A087')

/** My Wellness Balance halkaları (Figma: %88 Strong, %76 Healthy, %48 Low) */
export const WELLNESS: Record<Range, [number, number, number]> = {
  D: [80, 70, 55],
  W: [88, 76, 48],
  M: [84, 73, 52],
  '3M': [79, 70, 58],
  Y: [75, 68, 60],
}
export const wellnessLabel = (v: number) => (v >= 85 ? 'Strong' : v >= 60 ? 'Healthy' : 'Low')

/* ── Summary Comparison ── */
export type Metric = 'overall' | 'walk' | 'water' | 'sleep' | 'food'
export const METRICS: { id: Metric; label: string }[] = [
  { id: 'overall', label: 'All goals' },
  { id: 'walk', label: 'Walk' },
  { id: 'water', label: 'Water' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'food', label: 'Food' },
]
export type Period = 'Daily' | 'Weekly' | 'Monthly'

const fmt = (d: Date) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })

export function comparison(logs: Record<string, Partial<DayLog>>, period: Period, metric: Metric) {
  const today = startOfToday()
  const n = period === 'Daily' ? 1 : period === 'Weekly' ? 7 : 30
  const lift = period === 'Daily' ? 0 : 12
  const cur = Math.min(100, avgProgress(logs, n, 0, metric) + lift)
  const prev = Math.max(5, avgProgress(logs, n, n, metric) - (period === 'Monthly' ? 8 : 2))
  const labels = period === 'Daily' ? ['Today', 'Yesterday'] : period === 'Weekly' ? ['This Week', 'Last Week'] : ['This Month', 'Last Month']
  const range = n === 1 ? fmt(today) : `${fmt(addDays(today, -n + 1))} – ${fmt(today)}`
  const diff = cur - prev
  const since = period === 'Daily' ? 'yesterday' : period === 'Weekly' ? 'last week' : 'last month'
  const message = diff > 0 ? `Awesome! You’ve improved by ${diff}% since ${since}!` : diff === 0 ? `Steady as ${since} — consistency counts!` : `A little below ${since} — small steps get you back on track.`
  return { cur, prev, labels, range, message, diff }
}

/* ── Your Goals ── */
export type Goal = { id: string; title: string; text: string; base: number; value?: string; link?: 'meditation' | 'water' }
export type GoalSection = { id: string; title: string; goals: Goal[]; extra: Goal[] }

export const GOAL_SECTIONS: GoalSection[] = [
  {
    id: 'cardio',
    title: 'Walk & Cardio',
    goals: [
      { id: 'walk', title: 'Walk', text: 'Track your steps and keep your body moving every day.', base: 92, value: '4 km' },
      { id: 'run', title: 'Run', text: 'See your running progress and challenge yourself further.', base: 30, value: '3 km' },
    ],
    extra: [{ id: 'jump', title: 'Jump Rope', text: 'Boost your heart rate and coordination in minutes.', base: 15 }],
  },
  {
    id: 'mental',
    title: 'Mental Wellness',
    goals: [
      { id: 'meditation', title: 'Meditation', text: 'Relax your mind and improve focus with short sessions.', base: 48, link: 'meditation' },
      { id: 'stress', title: 'Stress Relief', text: 'Reflect and release tension to feel more balanced.', base: 92 },
    ],
    extra: [{ id: 'relaxing', title: 'Relaxing', text: 'Wind down with calm music and slow breathing.', base: 20 }],
  },
  {
    id: 'eating',
    title: 'Healthy Eating',
    goals: [
      { id: 'snacks', title: 'Snacks', text: 'Smart snacking helps you stay on track and satisfied.', base: 10 },
      { id: 'hydration', title: 'Hydration', text: 'Keep your body hydrated and feel refreshed all day.', base: 92, link: 'water' },
    ],
    extra: [{ id: 'veggies', title: 'Balanced Plate', text: 'Fill half your plate with vegetables at each meal.', base: 25 }],
  },
  {
    id: 'strength',
    title: 'Strength & Flexibility',
    goals: [
      { id: 'core', title: 'Core Strength', text: 'Plank, crunches, stability moves.', base: 50 },
      { id: 'upper', title: 'Upper Body', text: 'Tone your arms, chest, and back efficiently.', base: 92 },
    ],
    extra: [{ id: 'full', title: 'Full Body', text: 'Work every major muscle group in one session.', base: 30 }],
  },
]

/** Hedef yüzdesi seçili döneme göre (Daily / Weekly / Monthly) */
export function goalPct(g: Goal, period: Period, boost = 0) {
  const shift = period === 'Daily' ? -25 + Math.round(rand(g.id, 3) * 20) : period === 'Monthly' ? -8 : 0
  return Math.max(0, Math.min(100, g.base + shift + boost))
}
