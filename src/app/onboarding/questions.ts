/** Figma: Onboarding-2 … Onboarding-6 soruları ve seçenekleri */
import goalFitter from '../../assets/onboarding/goal-fitter.svg'
import goalEat from '../../assets/onboarding/goal-eat.svg'
import goalStress from '../../assets/onboarding/goal-stress.svg'
import goalSleep from '../../assets/onboarding/goal-sleep.svg'
import days1 from '../../assets/onboarding/days-1.svg'
import days3 from '../../assets/onboarding/days-3.svg'
import days5 from '../../assets/onboarding/days-5.svg'
import foodProtein from '../../assets/onboarding/food-protein.svg'
import foodBalanced from '../../assets/onboarding/food-balanced.svg'
import foodPlant from '../../assets/onboarding/food-plant.svg'
import foodQuick from '../../assets/onboarding/food-quick.svg'
import tipsSleep from '../../assets/onboarding/tips-sleep.svg'
import tipsStress from '../../assets/onboarding/tips-stress.svg'
import tipsHabits from '../../assets/onboarding/tips-habits.svg'
import tipsWeight from '../../assets/onboarding/tips-weight.svg'
import planStep from '../../assets/onboarding/plan-step.svg'
import planFlex from '../../assets/onboarding/plan-flex.svg'
import planIdeas from '../../assets/onboarding/plan-ideas.svg'

export type Option = { id: string; label: string; icon: string }
export type Question = { id: string; title: string; multi?: boolean; options: Option[] }

export const QUESTIONS: Question[] = [
  {
    id: 'goal',
    title: 'What’s your main goal?',
    options: [
      { id: 'fitter', label: 'Get fitter', icon: goalFitter },
      { id: 'eat', label: 'Eat healthier', icon: goalEat },
      { id: 'stress', label: 'Manage stress', icon: goalStress },
      { id: 'sleep', label: 'Improve sleep', icon: goalSleep },
    ],
  },
  {
    id: 'days',
    title: 'How many days a week would you like to exercise?',
    options: [
      { id: '1-2', label: '1–2 days (light activity)', icon: days1 },
      { id: '3-4', label: '3–4 days (steady routine)', icon: days3 },
      { id: '5+', label: '5+ days (active lifestyle)', icon: days5 },
    ],
  },
  {
    id: 'nutrition',
    title: 'Which area matters most to you?',
    options: [
      { id: 'protein', label: 'High protein meals', icon: foodProtein },
      { id: 'balanced', label: 'Balanced diet', icon: foodBalanced },
      { id: 'plant', label: 'Plant-based eating', icon: foodPlant },
      { id: 'quick', label: 'Quick & easy recipes', icon: foodQuick },
    ],
  },
  {
    id: 'tips',
    title: 'Which areas do you want tips for first?',
    multi: true,
    options: [
      { id: 'sleep', label: 'Sleep improvement', icon: tipsSleep },
      { id: 'stress', label: 'Stress relief techniques', icon: tipsStress },
      { id: 'habits', label: 'Daily healthy habits', icon: tipsHabits },
      { id: 'weight', label: 'Weight or fitness management', icon: tipsWeight },
    ],
  },
  {
    id: 'plan',
    title: 'How would you like your plan to feel?',
    options: [
      { id: 'step', label: 'Step-by-step guidance', icon: planStep },
      { id: 'flex', label: 'Flexible suggestions for each day', icon: planFlex },
      { id: 'ideas', label: 'Just inspiration and ideas', icon: planIdeas },
    ],
  },
]
