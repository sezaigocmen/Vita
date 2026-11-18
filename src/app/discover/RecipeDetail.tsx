/** Figma: Discover-3 – tarif detayı (Protein Bowl; diğer tarifler aynı şablonla) */
import { useNav, type ScreenProps } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { ScreenLayout, BackButton } from '../components/ScreenLayout'
import { useVita } from '../store'
import { dateKey, startOfToday } from '../data/daily'
import { recipeById } from '../data/discover'
import iconShare from '../../assets/home/icon-share.svg'
import iconSaved from '../../assets/home/icon-saved.svg'
import iconAi from '../../assets/home/icon-ai.svg'
import dIngredients from '../../assets/discover/d-ingredients.svg'
import dSteps from '../../assets/discover/d-steps.svg'
import dCalories from '../../assets/discover/d-calories.svg'
import dProtein from '../../assets/discover/d-protein.svg'
import dPrep from '../../assets/discover/d-prep.svg'

export function RecipeDetail({ params }: ScreenProps<{ id: string; sharedBy?: string }>) {
  const nav = useNav()
  const r = recipeById(params.id)
  const saved = useVita((s) => s.saved.includes(`recipe:${r.id}`))
  const toggleSaved = useVita((s) => s.toggleSaved)
  const updateLog = useVita((s) => s.updateLog)

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: r.title, text: `${r.title} — ${r.intro}`, url: location.origin })
      else {
        await navigator.clipboard.writeText(location.origin)
        toast('Link copied')
      }
    } catch {
      /* iptal */
    }
  }

  const cook = () => {
    updateLog(dateKey(startOfToday()), (c) => ({ proteinG: Math.min(400, c.proteinG + r.protein) }))
    toast(`🍽️ ${r.title} logged · +${r.protein} g protein`)
  }

  return (
    <ScreenLayout title="Discover">
      <div className="px-6 pt-[12px]">
        <div className="flex items-center justify-between">
          <BackButton onClick={nav.pop} />
          <div className="flex items-center gap-[12px]">
            <button aria-label="Share" onClick={share} className="pressable p-2">
              <img src={iconShare} alt="" className="h-4 w-4" />
            </button>
            <button
              aria-label={saved ? 'Remove from saved' : 'Save'}
              onClick={() => {
                toggleSaved(`recipe:${r.id}`)
                toast(saved ? 'Removed from saved' : 'Saved to your list')
              }}
              className="pressable p-2"
            >
              <img src={iconSaved} alt="" className={`h-[18px] w-[13px] transition-opacity ${saved ? 'opacity-100' : 'opacity-25'}`} />
            </button>
          </div>
        </div>

        <h1 className="mt-[2px] text-title3 font-semibold text-ink">{r.title}</h1>
        {params.sharedBy && <p className="text-[13px] text-black/50">Shared by {params.sharedBy}</p>}

        {r.photo ? (
          <img src={r.photo} alt={r.title} className="mt-[6px] h-[106px] w-full rounded-[22px] border border-black/10 object-cover shadow-card" />
        ) : (
          <div className="mt-[6px] flex h-[106px] w-full items-center justify-center rounded-[22px] border border-black/10 shadow-card" style={{ background: r.tint }}>
            <img src={r.icon} alt="" className="h-[64px] w-auto" />
          </div>
        )}

        <p className="mt-[20px] text-[14px] leading-[17px] text-ink">{r.intro}</p>

        <div className="mt-[14px] grid grid-cols-3 gap-[14px] px-[4px]">
          <Fact title="Prep Time" icon={dPrep} size={[29, 34]} value={r.prep} />
          <Fact title="Calories" icon={dCalories} size={[22, 36]} value={`${r.kcal} kcal`} />
          <Fact title="Protein" icon={dProtein} size={[35, 30]} value={`${r.protein}g`} />
        </div>

        <div className="mt-[14px] flex items-start gap-[9px]">
          <img src={iconAi} alt="" className="h-[18px] w-[20px] shrink-0" />
          <p className="text-[12px] leading-[15px] text-ink">{r.tip}</p>
        </div>

        <h2 className="mt-[20px] flex items-center gap-[8px] text-[15px] font-semibold text-ink">
          <img src={dIngredients} alt="" className="h-[28px] w-[22px]" /> Ingredients
        </h2>
        <ul className="mt-[8px] list-disc pl-[24px] text-[13px] leading-[17px] text-ink">
          {r.ingredients.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>

        <h2 className="mt-[20px] flex items-center gap-[10px] text-[15px] font-semibold text-ink">
          <img src={dSteps} alt="" className="h-[29px] w-[22px]" /> Steps
        </h2>
        <ol className="mt-[8px] list-decimal pl-[24px] text-[13px] leading-[17px] text-ink">
          {r.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <div className="mt-[16px] flex justify-center pb-4">
          <button onClick={cook} className="pressable h-[28px] rounded-chip bg-brand px-[30px] text-[14px] font-medium text-white shadow-btn">
            Cook Now
          </button>
        </div>
      </div>
    </ScreenLayout>
  )
}

function Fact({ title, icon, size, value }: { title: string; icon: string; size: [number, number]; value: string }) {
  return (
    <div className="flex h-[104px] flex-col items-center rounded-card border border-black/10 pt-[13px] shadow-card">
      <span className="text-[12px] font-bold leading-[14px] text-ink">{title}</span>
      <span className="flex flex-1 items-center">
        <img src={icon} alt="" style={{ width: size[0], height: size[1] }} />
      </span>
      <span className="pb-[11px] text-[11px] font-medium text-ink">{value}</span>
    </div>
  )
}
