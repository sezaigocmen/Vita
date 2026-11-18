import { AnimatePresence, motion } from 'motion/react'
import { Navigator, type ScreenMap, type TabDef } from '../shell/navigation'
import { TabBar } from './components/TabBar'
import { Welcome } from './intro/Welcome'
import { Features } from './intro/Features'
import { Trial } from './intro/Trial'
import { ReadyToBegin } from './onboarding/ReadyToBegin'
import { QuestionScreen } from './onboarding/QuestionScreen'
import { Analyzing } from './onboarding/Analyzing'
import { useVita } from './store'
import { HomeScreen } from './home/HomeScreen'
import { WaterDetail } from './home/WaterDetail'
import { TrackerDetail } from './home/TrackerDetail'
import { DiscoverScreen } from './discover/DiscoverScreen'
import { RecipeDetail } from './discover/RecipeDetail'
import { DiscoverList } from './discover/DiscoverList'
import { ProgressScreen } from './progress/ProgressScreen'
import { MeditationDetail } from './progress/MeditationDetail'
import { AiHome } from './ai/AiHome'
import { ChatScreen } from './ai/ChatScreen'
import { ChatHistory, SavedSuggest } from './ai/AiLists'
import { ProfileScreen } from './profile/ProfileScreen'

/* ── 1) Giriş akışı: Introduction → Onboarding (alt menü yok) ── */
const introTabs: TabDef[] = [{ id: 'intro', screen: 'welcome' }]
const introScreens: ScreenMap = {
  welcome: Welcome,
  features: Features,
  trial: Trial,
  onboarding: ReadyToBegin,
  'ob-question': QuestionScreen,
  'ob-analyzing': Analyzing,
}

/* ── 2) Ana uygulama: 5 sekme ── */
const tabs: TabDef[] = [
  { id: 'ai', screen: 'ai' },
  { id: 'discover', screen: 'discover' },
  { id: 'home', screen: 'home' },
  { id: 'progress', screen: 'progress' },
  { id: 'profile', screen: 'profile' },
]
const screens: ScreenMap = {
  ai: AiHome,
  'ai-chat': ChatScreen,
  'ai-history': ChatHistory,
  'ai-saved': SavedSuggest,
  discover: DiscoverScreen,
  recipe: RecipeDetail,
  'discover-list': DiscoverList,
  home: HomeScreen,
  progress: ProgressScreen,
  meditation: MeditationDetail,
  profile: ProfileScreen,
  'water-detail': WaterDetail,
  tracker: TrackerDetail,
}

export function App() {
  const onboarded = useVita((s) => s.onboarded)
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={onboarded ? 'main' : 'intro'}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      >
        {onboarded ? (
          <Navigator tabs={tabs} initialTab="home" screens={screens} tabBar={(nav, info) => <TabBar nav={nav} route={info.route} />} />
        ) : (
          <Navigator tabs={introTabs} initialTab="intro" screens={introScreens} />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
