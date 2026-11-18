/** Discover içerikleri (Figma: Discover-1/2/3). Protein Bowl dışındaki tarif detayları Figma diline uygun eklendi. */
import hl1 from '../../assets/discover/hl-1.jpg'
import hl2 from '../../assets/discover/hl-2.jpg'
import hl3 from '../../assets/discover/hl-3.jpg'
import proteinBowlPhoto from '../../assets/discover/protein-bowl.jpg'
import wCardio from '../../assets/discover/w-cardio.svg'
import wStrength from '../../assets/discover/w-strength.svg'
import wYoga from '../../assets/discover/w-yoga.svg'
import wStretch from '../../assets/discover/w-stretch.svg'
import rAvocado from '../../assets/discover/r-avocado.svg'
import rProtein from '../../assets/discover/r-protein.svg'
import rSmoothie from '../../assets/discover/r-smoothie.svg'
import rRice from '../../assets/discover/r-rice.svg'
import mCalm from '../../assets/discover/m-calm.svg'
import mMusic from '../../assets/discover/m-music.svg'
import mMorning from '../../assets/discover/m-morning.svg'
import mSleep from '../../assets/discover/m-sleep.svg'
import cSuccess from '../../assets/discover/c-success.svg'
import cTips from '../../assets/discover/c-tips.svg'
import cChallenge from '../../assets/discover/c-challenge.svg'
import cRecipes from '../../assets/discover/c-recipes.svg'

export const HIGHLIGHTS = [
  { id: 'morning-flow', title: 'Morning Energy\nFlow', text: 'Start your day with a 10-min stretch routine.', img: hl2 },
  { id: 'sunset-balance', title: 'Sunset\nBalance', text: 'Unwind with a 15-min tai chi flow.', img: hl1 },
  { id: 'golden-run', title: 'Golden Hour\nRun', text: 'An easy 20-min run to lift your mood.', img: hl3 },
]

export type Item = { id: string; title: string; text: string; cta: string; icon: string }

export const WORKOUTS: Item[] = [
  { id: 'cardio', title: 'Cardio', text: 'Burn Calories', cta: 'Let’s Try', icon: wCardio },
  { id: 'strength', title: 'Strength', text: 'Get Stronger', cta: 'Let’s Try', icon: wStrength },
  { id: 'yoga', title: 'Yoga', text: 'Find Balance', cta: 'Let’s Try', icon: wYoga },
  { id: 'stretch', title: 'Stretch', text: 'Stay Flexible', cta: 'Let’s Try', icon: wStretch },
]
/** Başlanmış antrenmanların ilerlemesi (Figma'da Yoga ve Stretch "Continue" durumunda) */
export const WORKOUT_PROGRESS_SEED: Record<string, number> = { yoga: 84, stretch: 59 }

export const MIND: Item[] = [
  { id: 'calm', title: 'Calm Breathing', text: '5 min • Stress Relief', cta: 'Start Now', icon: mCalm },
  { id: 'music', title: 'Mindful Music', text: '10 min • Deep Focus', cta: 'Listen', icon: mMusic },
  { id: 'morning', title: 'Morning Focus', text: '5 min • Positive Mindset', cta: 'Find Calm', icon: mMorning },
  { id: 'sleep', title: 'Sleep Down', text: '15 min • Better Sleep', cta: 'Relax Now', icon: mSleep },
]

export const COMMUNITY: (Item & { story?: { title: string; body: string } })[] = [
  {
    id: 'success',
    title: 'Success Stories',
    text: 'First 10K Steps',
    cta: 'Read',
    icon: cSuccess,
    story: {
      title: 'Ayla’s first 10K steps',
      body: '“I started with short walks after lunch. Three weeks later I hit 10,000 steps for the first time — and my afternoon slump disappeared.”',
    },
  },
  {
    id: 'tips',
    title: 'Community Tips',
    text: 'Hydration Trick',
    cta: 'Try it',
    icon: cTips,
    story: {
      title: 'The hydration trick',
      body: 'Keep a glass of water next to your coffee machine. Drink it while your coffee brews — an easy +400 ml before your day even starts.',
    },
  },
  { id: 'yoga-flow', title: 'Challenge Highlights', text: 'Daily Yoga Flow', cta: 'Join', icon: cChallenge },
  { id: 'lana', title: 'Recipe Shares', text: 'Lana Shared', cta: 'Cook Now', icon: cRecipes },
]

export type Recipe = {
  id: string
  title: string
  card: string
  cta: string
  icon: string
  photo?: string
  tint: string
  intro: string
  prep: string
  kcal: number
  protein: number
  tip: string
  ingredients: string[]
  steps: string[]
}

export const RECIPES: Recipe[] = [
  {
    id: 'avocado',
    title: 'Avocado Toast',
    card: '5 min • 250 kcal',
    cta: 'Try it',
    icon: rAvocado,
    tint: '#E4EFD9',
    intro: 'A creamy, crunchy breakfast ready in five minutes.',
    prep: '5 min',
    kcal: 250,
    protein: 12,
    tip: 'Add a poached egg for an extra 6 g of protein.',
    ingredients: ['1 slice whole-grain bread', '½ ripe avocado', 'Squeeze of lemon', 'Cherry tomatoes, halved', 'Pinch of salt & chili flakes'],
    steps: ['Toast the bread until golden.', 'Mash the avocado with lemon and salt.', 'Spread on the toast and top with tomatoes.', 'Finish with chili flakes and enjoy.'],
  },
  {
    id: 'protein-bowl',
    title: 'Protein Bowl',
    card: '20 min • High Protein',
    cta: 'Cook Now',
    icon: rProtein,
    photo: proteinBowlPhoto,
    tint: '#E8EEF0',
    intro: 'Fuel your body with a balanced, high-protein meal.',
    prep: '15–20 min',
    kcal: 450,
    protein: 60,
    tip: 'Swap chicken for chickpeas to make it vegan-friendly.',
    ingredients: [
      '100g grilled chicken or tofu',
      '50g quinoa or brown rice',
      '1 cup mixed greens',
      '½ avocado, sliced',
      'Cherry tomatoes, cucumber, carrots',
      '1 tbsp olive oil & lemon dressing',
    ],
    steps: [
      'Cook quinoa or rice and let it cool.',
      'Grill chicken or tofu, season lightly.',
      'Assemble greens in a bowl, add grains, protein, and veggies.',
      'Drizzle dressing on top.',
      'Enjoy immediately or pack for lunch!',
    ],
  },
  {
    id: 'smoothie',
    title: 'Smoothie',
    card: '5 min • Refreshing',
    cta: 'Blend it',
    icon: rSmoothie,
    tint: '#F8E6DE',
    intro: 'A refreshing berry blend to recharge between meals.',
    prep: '5 min',
    kcal: 220,
    protein: 18,
    tip: 'Use a frozen banana instead of ice for a creamier texture.',
    ingredients: ['1 cup mixed berries', '1 banana', '150 g Greek yogurt', '150 ml almond milk', '1 tsp honey'],
    steps: ['Add everything to a blender.', 'Blend for 45–60 seconds until smooth.', 'Pour into a glass and enjoy right away.'],
  },
  {
    id: 'rice-pudding',
    title: 'Rice Pudding',
    card: '15 min • Sweet',
    cta: 'Try it',
    icon: rRice,
    tint: '#F6EDD6',
    intro: 'A light, comforting dessert with a hint of cinnamon.',
    prep: '15 min',
    kcal: 280,
    protein: 8,
    tip: 'Swap sugar for chopped dates to keep it naturally sweet.',
    ingredients: ['60 g short-grain rice', '400 ml milk', '1 tbsp honey', '½ tsp cinnamon', 'Pinch of vanilla'],
    steps: ['Simmer the rice in milk on low heat, stirring often.', 'Cook for 12–15 minutes until creamy.', 'Stir in honey and vanilla.', 'Serve warm with a dusting of cinnamon.'],
  },
]

export const recipeById = (id: string) => RECIPES.find((r) => r.id === id) ?? RECIPES[1]
