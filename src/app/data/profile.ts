/** Profil demo verisi (Figma: Profile-1 / -2) ve düzenleme seçenekleri. Gerçek kişi değildir. */
export type Profile = { name: string; age: number; gender: string; height: number; weight: number; blood: string }
export type HealthData = { chronic: string[]; allergies: string[]; stress: string; sleep: string; energy: string }
export type ProfileLists = { goals: string[]; diet: string[]; exercise: string[] }

export const PROFILE_SEED: Profile = { name: 'Meloni Sparks', age: 25, gender: 'Female', height: 170, weight: 70, blood: 'A+' }
export const LISTS_SEED: ProfileLists = {
  goals: ['Lose Weight', 'Build Muscle', 'Stress Management'],
  diet: ['Omnivore'],
  exercise: ['Workout Frequency'],
}
export const HEALTH_SEED: HealthData = { chronic: ['Diabetes', 'Hypertension'], allergies: ['Peanuts', 'Pollen'], stress: 'Moderate', sleep: 'Good', energy: 'Tired' }

export const OPTIONS = {
  gender: ['Female', 'Male', 'Non-binary', 'Prefer not to say'],
  blood: ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'],
  goals: ['Lose Weight', 'Build Muscle', 'Stress Management', 'Improve Sleep', 'Eat Healthier', 'Run a 5K', 'More Energy', 'Better Flexibility'],
  diet: ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Mediterranean', 'Low Carb', 'Gluten-Free'],
  exercise: ['Workout Frequency', 'Morning Workouts', 'Home Workouts', 'Gym Access', 'Outdoor Activities', 'Low-Impact Only'],
  chronic: ['Diabetes', 'Hypertension', 'Asthma', 'High Cholesterol', 'Thyroid', 'None'],
  allergies: ['Peanuts', 'Pollen', 'Lactose', 'Gluten', 'Shellfish', 'Dust', 'None'],
  stress: ['Low', 'Moderate', 'High'],
  sleep: ['Poor', 'Fair', 'Good', 'Great'],
  energy: ['Tired', 'Okay', 'Energized'],
}

/** Liste bölümleri: başlık + seçenek anahtarı */
export const LIST_SECTIONS: { id: keyof ProfileLists; title: string }[] = [
  { id: 'goals', title: 'Goals' },
  { id: 'diet', title: 'Diet Preference' },
  { id: 'exercise', title: 'Exercise Information' },
]

/** Onboarding'deki haftalık gün cevabı → Workout Frequency etiketi */
export const FREQ_LABEL: Record<string, string> = { '1-2': '1–2 days a week', '3-4': '3–4 days a week', '5+': '5+ days a week' }
