/**
 * Uygulama verisi: tarayıcı hafızasında (localStorage) saklanır.
 * İlk açılışta demo verisiyle başlar. Gerçek kişisel veri toplanmaz.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedLog, type DayLog } from './data/daily'
import { WORKOUT_PROGRESS_SEED } from './data/discover'
import { seedMed, type MedLog } from './data/progress'
import type { ChatMsg } from './data/coach'
import { HEALTH_SEED, LISTS_SEED, PROFILE_SEED, type HealthData, type Profile, type ProfileLists } from './data/profile'

export type SavedChat = { id: string; title: string; date: string; messages: ChatMsg[] }
export type SavedTip = { id: string; text: string; date: string }

const STORAGE_KEY = 'vita-demo-v1'

/** Onboarding cevapları: soru id → seçilen seçenek id'leri */
export type Answers = Record<string, string[]>

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

interface VitaState {
  onboarded: boolean
  user: { name: string }
  answers: Answers
  /** Günlük kayıtlarda kullanıcının değiştirdiği değerler (tarih → değer) */
  logs: Record<string, Partial<DayLog>>
  claimed: string[]
  accepted: string[]
  saved: string[]
  setOnboarded: (v: boolean) => void
  setAnswer: (questionId: string, values: string[]) => void
  addGlasses: (key: string, delta: number) => void
  /** Bir günün değerlerini günceller (ör. uyku süresi, protein, mesafe) */
  updateLog: (key: string, fn: (cur: DayLog) => Partial<DayLog>) => void
  /** Devam eden yürüyüş (demo) */
  walkActive: boolean
  setWalkActive: (v: boolean) => void
  /** Discover antrenman ilerlemeleri (id → %) */
  workouts: Record<string, number>
  setWorkout: (id: string, pct: number) => void
  /** Meditasyon kayıtları (tarih → dakika/oturum) */
  med: Record<string, Partial<MedLog>>
  addMeditation: (key: string, minutes: number, newSession: boolean) => void
  /** Your Goals: eklenen hedefler ve kullanıcının işlediği ilerleme */
  addedGoals: string[]
  goalBoost: Record<string, number>
  addGoal: (id: string) => void
  boostGoal: (id: string, by: number) => void
  /** AI: kaydedilen sohbetler ve öneriler */
  chats: SavedChat[]
  savedTips: SavedTip[]
  /** Profil (demo kişi) */
  profile: Profile
  lists: ProfileLists
  health: HealthData
  setProfile: (p: Profile) => void
  setList: (id: keyof ProfileLists, items: string[]) => void
  setHealth: (h: Partial<HealthData>) => void
  saveChat: (chat: SavedChat) => void
  deleteChat: (id: string) => void
  toggleTip: (tip: SavedTip) => void
  toggleClaim: (id: string) => void
  toggleAccept: (id: string) => void
  toggleSaved: (id: string) => void
}

export const useVita = create<VitaState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      user: { name: 'Meloni' },
      answers: {},
      logs: {},
      claimed: [],
      accepted: ['step'],
      saved: [],
      setOnboarded: (onboarded) => set({ onboarded }),
      setAnswer: (questionId, values) => set((s) => ({ answers: { ...s.answers, [questionId]: values } })),
      addGlasses: (key, delta) => {
        const cur = getLog(get().logs, key)
        const glasses = Math.max(0, Math.min(20, cur.glasses + delta))
        set((s) => ({ logs: { ...s.logs, [key]: { ...s.logs[key], glasses } } }))
      },
      updateLog: (key, fn) => {
        const cur = getLog(get().logs, key)
        set((s) => ({ logs: { ...s.logs, [key]: { ...s.logs[key], ...fn(cur) } } }))
      },
      walkActive: false,
      setWalkActive: (walkActive) => set({ walkActive }),
      workouts: { ...WORKOUT_PROGRESS_SEED },
      setWorkout: (id, pct) => set((s) => ({ workouts: { ...s.workouts, [id]: pct } })),
      med: {},
      addMeditation: (key, minutes, newSession) => {
        const cur = { ...seedMed(key), ...get().med[key] }
        set((s) => ({ med: { ...s.med, [key]: { min: cur.min + minutes, sessions: cur.sessions + (newSession ? 1 : 0) } } }))
      },
      addedGoals: [],
      goalBoost: {},
      addGoal: (id) => set((s) => ({ addedGoals: s.addedGoals.includes(id) ? s.addedGoals : [...s.addedGoals, id] })),
      boostGoal: (id, by) => set((s) => ({ goalBoost: { ...s.goalBoost, [id]: (s.goalBoost[id] ?? 0) + by } })),
      profile: PROFILE_SEED,
      lists: LISTS_SEED,
      health: HEALTH_SEED,
      setProfile: (profile) => set({ profile, user: { name: profile.name.split(' ')[0] || 'Friend' } }),
      setList: (id, items) => set((s) => ({ lists: { ...s.lists, [id]: items } })),
      setHealth: (h) => set((s) => ({ health: { ...s.health, ...h } })),
      chats: [],
      savedTips: [],
      saveChat: (chat) => set((s) => ({ chats: [chat, ...s.chats.filter((c) => c.id !== chat.id)] })),
      deleteChat: (id) => set((s) => ({ chats: s.chats.filter((c) => c.id !== id) })),
      toggleTip: (tip) =>
        set((s) => ({ savedTips: s.savedTips.some((t) => t.id === tip.id) ? s.savedTips.filter((t) => t.id !== tip.id) : [tip, ...s.savedTips] })),
      toggleClaim: (id) => set((s) => ({ claimed: toggle(s.claimed, id) })),
      toggleAccept: (id) => set((s) => ({ accepted: toggle(s.accepted, id) })),
      toggleSaved: (id) => set((s) => ({ saved: toggle(s.saved, id) })),
    }),
    { name: STORAGE_KEY },
  ),
)

/** Bir günün değerleri: demo tohum değerleri + kullanıcının değişiklikleri */
export function getLog(logs: VitaState['logs'], key: string): DayLog {
  return { ...seedLog(key), ...logs[key] }
}
export const useDayLog = (key: string) => {
  const override = useVita((s) => s.logs[key])
  return { ...seedLog(key), ...override }
}

/** Demoyu ilk haline döndürür. */
export function resetDemo() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* gizli sekme vb. */
  }
  window.location.reload()
}
