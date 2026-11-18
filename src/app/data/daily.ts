/**
 * Günlük takip verisi (demo). Her gün için değerler tarihe göre sabit bir şekilde üretilir,
 * kullanıcının yaptığı değişiklikler (ör. su içme) store'da bunların üzerine yazılır.
 */
export type DayLog = { walkKm: number; glasses: number; sleepMin: number; proteinG: number }

export const TARGETS = { walkKm: 10, glasses: 6, sleepMin: 480, proteinG: 180 }
export const GLASS_ML = 400

export const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
export const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** Tarihten sabit sözde-rastgele sayı (0–1) */
function rand(key: string, salt: number) {
  let h = 2166136261 ^ salt
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619)
  return ((h >>> 0) % 1000) / 1000
}

/** Demo değerleri: bugün sabah durumu, geçmiş günler tamamlanmış günler */
export function seedLog(key: string): DayLog {
  if (key === dateKey(startOfToday())) return { walkKm: 2, glasses: 4, sleepMin: 430, proteinG: 160 }
  return {
    walkKm: Math.round((3 + rand(key, 1) * 8) * 10) / 10,
    glasses: 3 + Math.round(rand(key, 2) * 4),
    sleepMin: 360 + Math.round(rand(key, 3) * 14) * 10,
    proteinG: 90 + Math.round(rand(key, 4) * 10) * 10,
  }
}

const pct = (v: number, t: number) => Math.min(100, Math.round((v / t) * 100))

export function progressOf(log: DayLog) {
  const walk = pct(log.walkKm, TARGETS.walkKm)
  const water = pct(log.glasses, TARGETS.glasses)
  const sleep = pct(log.sleepMin, TARGETS.sleepMin)
  const food = pct(log.proteinG, TARGETS.proteinG)
  return { walk, water, sleep, food, overall: Math.round((walk + water + sleep + food) / 4) }
}

export const fmtLitres = (glasses: number) => `${+((glasses * GLASS_ML) / 1000).toFixed(1)} L`
export const fmtSleep = (min: number) => `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ''}`
