/**
 * Vita AI Coach – hazır cevap motoru (gerçek yapay zekâ yok, ücretsiz).
 * - Öneri butonları çok adımlı senaryoları başlatır (Weekly yoga schedule = Figma AI-3 metni)
 * - Serbest yazılan mesajlar anahtar kelimelere göre bir konuya eşlenir
 * - Bazı cevaplar uygulamada işlem yapan bir buton taşır (tarif aç, meditasyon başlat…)
 * İleride gerçek bir modele geçilirse sadece reply() fonksiyonunun yerine API çağrısı gelir.
 */

export type CoachAction =
  | { kind: 'recipe'; id: string; label: string }
  | { kind: 'meditation'; minutes: number; label: string }
  | { kind: 'walk'; label: string }
  | { kind: 'water'; label: string }
  | { kind: 'saveTip'; label: string }

export type ChatMsg = { id: string; role: 'ai' | 'user'; text: string; replies?: string[]; action?: CoachAction; chip?: boolean }

export type Ctx = { name: string; walkKm: number; glasses: number; sleepMin: number; proteinG: number; goal: string }
export type FlowState = { flow: string; step: number } | null

export const SUGGESTIONS = ['Healthy recipe idea', 'Weekly yoga schedule', 'Easy meal prep', 'Lose weight goal', 'Mini meditation', 'Daily walking goal']

export const greeting = (name: string): ChatMsg => ({
  id: 'hello',
  role: 'ai',
  text: `Hello ${name}! What would you like to do today for your health and goals?`,
})

type Step = { text: (c: Ctx, input: string) => string; replies?: string[]; action?: (c: Ctx, input: string) => CoachAction | undefined; end?: boolean }

const MORE = ['Healthy recipe idea', 'Mini meditation', 'Daily walking goal']

const FLOWS: Record<string, Step[]> = {
  /* Figma AI-3 – birebir akış */
  yoga: [
    { text: () => 'Do you want me to customize it for your current fitness level or stick to a beginner-friendly plan?', replies: ['Yes, please.', 'Beginner-friendly'] },
    { text: () => 'Great! Let’s start with your preferred session length. Do you have 15, 20, or 30 minutes per session?', replies: ['15 minutes', '20 minutes works best.', '30 minutes'] },
    {
      text: (_, i) => {
        const m = /15/.test(i) ? 15 : /30/.test(i) ? 30 : 20
        return `Perfect! Here’s your weekly yoga plan:\n• Monday: Morning stretch flow (${m} min) 🌅\n• Wednesday: Core & balance session (${m} min) 🧘\n• Friday: Relaxing evening flow (${m} min) 🌙\n\nDo you want me to set reminders for each session?`
      },
      replies: ['Yes, please.', 'No, thanks.'],
      action: () => ({ kind: 'saveTip', label: 'Save this plan' }),
    },
    {
      text: (_, i) =>
        /no/i.test(i)
          ? 'No problem — your plan is ready whenever you are. Would you like tips for proper form during each session?'
          : 'All set! ⏰ I’ve scheduled your yoga sessions. You’ll get a gentle reminder before each one. Would you like tips for proper form during each session?',
      replies: ['Yes, please.', 'Maybe later'],
    },
    {
      text: (_, i) =>
        /later/i.test(i)
          ? 'Sounds good. Enjoy your week of yoga! 🌟'
          : 'Awesome! I’ll show simple visual cues and breathing tips before each session starts. You’re all set to enjoy your week of yoga! 🌟',
      replies: MORE,
      end: true,
    },
  ],

  recipe: [
    {
      text: (c) =>
        c.goal === 'eat' || c.proteinG < 120
          ? `Here’s a high-protein pick for you: Protein Bowl 🥗 — 20 min, 450 kcal, 60 g protein. You’re at ${c.proteinG} g today, so this gets you close to your goal. Want the full recipe?`
          : 'How about a Protein Bowl 🥗? 20 minutes, 450 kcal and packed with protein. Want the full recipe?',
      replies: ['Show me the recipe', 'Something lighter'],
    },
    {
      text: (_, i) =>
        /light/i.test(i)
          ? 'Try a Berry Smoothie 🍓 — 5 minutes, 220 kcal and 18 g protein. Perfect between meals.'
          : 'Here you go! Tap below to open the recipe with ingredients and steps.',
      action: (_, i) => (/light/i.test(i) ? { kind: 'recipe', id: 'smoothie', label: 'Open Smoothie' } : { kind: 'recipe', id: 'protein-bowl', label: 'Open Protein Bowl' }),
      replies: ['Easy meal prep', 'Daily walking goal'],
      end: true,
    },
  ],

  mealprep: [
    { text: () => 'Let’s keep it simple 🍱 How many days would you like to prep for?', replies: ['3 days', '5 days'] },
    {
      text: (_, i) =>
        `Here’s an easy ${/5/.test(i) ? '5' : '3'}-day prep:\n• Cook a big batch of quinoa and roasted veggies\n• Grill chicken or tofu for Protein Bowls\n• Prep overnight oats for breakfasts\n• Wash and portion berries for smoothies\n\nIt takes about 60 minutes on Sunday. Want me to save this plan?`,
      replies: ['Yes, please.', 'No, thanks.'],
      action: () => ({ kind: 'saveTip', label: 'Save meal prep plan' }),
    },
    { text: (_, i) => (/no/i.test(i) ? 'All good! Happy cooking 👩‍🍳' : 'Saved! You’ll find it under Saved Suggest. Happy cooking 👩‍🍳'), replies: MORE, end: true },
  ],

  weight: [
    { text: () => 'A gentle, sustainable pace is about 0.5 kg per week. Shall I set that as your goal?', replies: ['Yes, please.', 'Tell me more'] },
    {
      text: (_, i) =>
        /more/i.test(i)
          ? 'Slow and steady keeps energy up and makes results last. We’ll focus on three daily wins: 8,000 steps, 6 glasses of water and protein at every meal. Ready to start?'
          : 'Done! 🎯 I’ll track it with your steps, meals and water. Your three daily wins: 8,000 steps, 6 glasses of water and protein at every meal.',
      replies: ['Daily walking goal', 'Healthy recipe idea'],
      end: true,
    },
  ],

  meditation: [
    { text: () => 'Let’s take a short break 🧘 How long do you have?', replies: ['3 minutes', '5 minutes', '10 minutes'] },
    {
      text: (_, i) => {
        const m = parseInt(i) || 5
        return `Here’s a ${m}-minute reset:\n1. Sit comfortably and relax your shoulders\n2. Breathe in for 4 counts, hold for 4\n3. Breathe out slowly for 6 counts\n4. Repeat and notice how your body feels\n\nTap below when you’re ready — I’ll log it to your Progress.`
      },
      action: (_, i) => ({ kind: 'meditation', minutes: parseInt(i) || 5, label: 'Start session' }),
      replies: ['Weekly yoga schedule', 'Daily walking goal'],
      end: true,
    },
  ],

  walking: [
    {
      text: (c) => `You’re at ${c.walkKm} km today 🚶 Want to aim for 8,000 steps (about 6 km)?`,
      replies: ['Yes, please.', 'Make it 10,000'],
    },
    {
      text: (_, i) =>
        `Goal set: ${/10/.test(i) ? '10,000' : '8,000'} steps a day! A 15-minute walk after lunch gets you about 1.5 km closer. Want to start one now?`,
      action: () => ({ kind: 'walk', label: 'Start a walk' }),
      replies: ['Mini meditation', 'Healthy recipe idea'],
      end: true,
    },
  ],
}

const FLOW_BY_CHIP: Record<string, string> = {
  'Healthy recipe idea': 'recipe',
  'Weekly yoga schedule': 'yoga',
  'Easy meal prep': 'mealprep',
  'Lose weight goal': 'weight',
  'Mini meditation': 'meditation',
  'Daily walking goal': 'walking',
}

/** Serbest yazılan mesajlar için konu eşleştirme (İngilizce + birkaç Türkçe kelime) */
const TOPICS: { re: RegExp; reply: (c: Ctx) => Omit<ChatMsg, 'id' | 'role'>; flow?: string }[] = [
  {
    re: /\b(pain|hurt|sick|ill|doctor|medicine|medication|injur|dizzy|chest)|ağrı|hasta|doktor|ilaç/i,
    reply: () => ({
      text: 'I’m sorry you’re not feeling well. I can’t give medical advice — please check in with a healthcare professional. If it feels urgent, contact local emergency services. 💚',
      replies: ['Mini meditation'],
    }),
  },
  { re: /\b(hi|hello|hey|good (morning|evening))\b|merhaba|selam/i, reply: (c) => ({ text: `Hi ${c.name}! 👋 How can I help you today?`, replies: SUGGESTIONS.slice(0, 3) }) },
  { re: /\b(thanks|thank you|thx)\b|teşekkür|sağol/i, reply: () => ({ text: 'Anytime! I’m here whenever you need a nudge. 🌱', replies: MORE }) },
  {
    re: /water|hydrat|drink|thirst|\bsu\b/i,
    reply: (c) => ({
      text:
        c.glasses >= 6
          ? `Great job — you’ve had ${c.glasses} glasses today and reached your goal! 💧`
          : `You’ve had ${c.glasses} glasses of water today — ${6 - c.glasses} more to reach your goal. Try a glass 30 minutes before your workout. 💧`,
      action: { kind: 'water', label: 'Log a glass' },
    }),
  },
  {
    re: /sleep|tired|insomnia|rest|uyku|yorgun/i,
    reply: (c) => ({
      text: `You slept about ${Math.floor(c.sleepMin / 60)} hours last night. For deeper sleep tonight: dim screens an hour before bed, keep the room cool, and try a 5-minute breathing session. 🌙`,
      replies: ['Mini meditation'],
    }),
  },
  { re: /yoga/i, reply: () => ({ text: '' }), flow: 'yoga' },
  { re: /meal prep|prep/i, reply: () => ({ text: '' }), flow: 'mealprep' },
  { re: /recipe|protein|eat|food|meal|breakfast|lunch|dinner|snack|hungry|yemek|tarif/i, reply: () => ({ text: '' }), flow: 'recipe' },
  { re: /weight|lose|fat|diet|kilo/i, reply: () => ({ text: '' }), flow: 'weight' },
  { re: /stress|anxious|anxiety|calm|breath|meditat|relax|stres|nefes/i, reply: () => ({ text: '' }), flow: 'meditation' },
  { re: /walk|step|run|cardio|jog|yürü|koş/i, reply: () => ({ text: '' }), flow: 'walking' },
  {
    re: /motivat|lazy|can'?t|bored|unmotivated/i,
    reply: () => ({ text: 'Totally normal! Start tiny: a 5-minute walk or one glass of water counts. Small wins build momentum. 💪', replies: ['Daily walking goal', 'Mini meditation'] }),
  },
  {
    re: /who are you|what can you do|help|ne yapabilirsin/i,
    reply: () => ({ text: 'I’m Vita, your wellness coach. I can plan workouts, suggest recipes, guide quick meditations and keep an eye on your water, sleep and steps.', replies: SUGGESTIONS.slice(0, 3) }),
  },
]

const FALLBACK = (): Omit<ChatMsg, 'id' | 'role'> => ({
  text: 'I’m Vita’s demo coach, so I work best with topics like workouts, meals, water, sleep and mindfulness. Try one of these:',
  replies: SUGGESTIONS.slice(0, 4),
})

let seq = 0
const id = () => `m${Date.now()}-${seq++}`

/** Kullanıcı mesajına cevap üretir. Senaryo içindeyse sıradaki adıma geçer. */
export function reply(input: string, state: FlowState, c: Ctx): { msg: ChatMsg; state: FlowState } {
  const chipFlow = FLOW_BY_CHIP[input]
  // Yeni senaryo başlat (öneri butonu)
  if (chipFlow) return runStep(chipFlow, 0, input, c)
  // Devam eden senaryo
  if (state && FLOWS[state.flow][state.step]) return runStep(state.flow, state.step, input, c)
  // Serbest metin
  for (const t of TOPICS) {
    if (t.re.test(input)) {
      if (t.flow) return runStep(t.flow, 0, input, c)
      return { msg: { id: id(), role: 'ai', ...t.reply(c) }, state: null }
    }
  }
  return { msg: { id: id(), role: 'ai', ...FALLBACK() }, state: null }
}

function runStep(flow: string, step: number, input: string, c: Ctx) {
  const s = FLOWS[flow][step]
  const msg: ChatMsg = { id: id(), role: 'ai', text: s.text(c, input), replies: s.replies, action: s.action?.(c, input) }
  return { msg, state: s.end ? null : { flow, step: step + 1 } }
}

export const userMsg = (text: string, chip = false): ChatMsg => ({ id: id(), role: 'user', text, chip })

/** Kaydedilen sohbet için başlık */
export function chatTitle(msgs: ChatMsg[]) {
  const first = msgs.find((m) => m.role === 'user')
  return first ? first.text.slice(0, 40) : 'New chat'
}
