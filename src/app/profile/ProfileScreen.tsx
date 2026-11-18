/** Figma: Profile-1 / Profile-2 */
import { Reorder } from 'motion/react'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { ScreenLayout } from '../components/ScreenLayout'
import { resetDemo, useVita } from '../store'
import { FREQ_LABEL, LIST_SECTIONS, OPTIONS, type HealthData } from '../data/profile'
import { ChoiceSheet, EditProfileSheet, HealthCard, SwipeRow } from './ProfileParts'
import avatarBig from '../../assets/profile/avatar-big.svg'
import iconEdit from '../../assets/profile/icon-edit.svg'
import hChronic from '../../assets/profile/h-chronic.svg'
import hAllergies from '../../assets/profile/h-allergies.svg'
import hStress from '../../assets/profile/h-stress.svg'
import hSleep from '../../assets/profile/h-sleep.svg'
import hEnergy from '../../assets/profile/h-energy.svg'

export function ProfileScreen() {
  const nav = useNav()
  const profile = useVita((s) => s.profile)
  const lists = useVita((s) => s.lists)
  const health = useVita((s) => s.health)
  const days = useVita((s) => s.answers.days?.[0])
  const setProfile = useVita((s) => s.setProfile)
  const setList = useVita((s) => s.setList)
  const setHealth = useVita((s) => s.setHealth)
  const setOnboarded = useVita((s) => s.setOnboarded)

  const rows: [string, string][] = [
    ['Age:', String(profile.age)],
    ['Gender:', profile.gender],
    ['Height:', `${profile.height} cm`],
    ['Weight:', `${profile.weight} kg`],
    ['Blood Type:', profile.blood],
  ]

  const editProfile = () =>
    nav.openSheet((close) => (
      <EditProfileSheet
        profile={profile}
        onSave={(p) => {
          setProfile(p)
          toast('Profile updated')
          close()
        }}
      />
    ))

  const addTo = (id: (typeof LIST_SECTIONS)[number]['id'], title: string) => {
    const available = OPTIONS[id].filter((o) => !lists[id].includes(o))
    nav.openSheet((close) => (
      <ChoiceSheet
        title={`Add to ${title}`}
        hint={available.length ? 'Tap to add' : 'Everything is already on your list.'}
        options={available}
        selected={[]}
        onDone={([v]) => {
          if (v) {
            setList(id, [...lists[id], v])
            toast(`${v} added`)
          }
          close()
        }}
      />
    ))
  }

  const editHealth = (key: keyof HealthData, title: string, multi: boolean) =>
    nav.openSheet((close) => (
      <ChoiceSheet
        title={title}
        hint={multi ? 'Select all that apply' : undefined}
        options={OPTIONS[key]}
        selected={multi ? (health[key] as string[]) : [health[key] as string]}
        multi={multi}
        onDone={(v) => {
          setHealth({ [key]: multi ? (v.length ? v : ['None']) : v[0] })
          toast(`${title} updated`)
          close()
        }}
      />
    ))

  const rowLabel = (item: string) => (item === 'Workout Frequency' && days ? `Workout Frequency · ${FREQ_LABEL[days]}` : item)

  return (
    <ScreenLayout title="Profile">
      {/* Profil kartı */}
      <section className="px-6 pt-[14px]">
        <div className="flex justify-end">
          <button aria-label="Edit profile" onClick={editProfile} className="pressable -mr-1 p-1">
            <img src={iconEdit} alt="" className="h-[19px] w-[19px]" />
          </button>
        </div>
        <div className="mt-[3px] flex items-center justify-between rounded-card border border-black/10 bg-bg py-[13px] pl-[14px] pr-[24px] shadow-card">
          <div className="min-w-0">
            <h2 className="truncate text-title3 font-semibold text-ink">{profile.name}</h2>
            <dl className="mt-[10px] grid grid-cols-[auto_1fr] gap-x-[14px] gap-y-[2px] text-[13px] leading-[16px] text-ink">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-medium">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-full border border-black/10 shadow-card">
            <img src={avatarBig} alt="" className="h-[80px] w-[69px]" />
          </div>
        </div>
      </section>

      {/* Goals / Diet Preference / Exercise Information */}
      {LIST_SECTIONS.map((s, i) => (
        <section key={s.id} className={i === 0 ? 'mt-[34px]' : 'mt-[20px]'}>
          <div className="flex items-center justify-between px-6 pb-[4px]">
            <h2 className="text-title3 font-semibold text-ink">{s.title}</h2>
            <button aria-label={`Add to ${s.title}`} onClick={() => addTo(s.id, s.title)} className="pressable -my-1 px-1 text-[28px] font-extralight leading-none text-ink">
              +
            </button>
          </div>
          <Reorder.Group axis="y" values={lists[s.id]} onReorder={(v) => setList(s.id, v)} className="border-t border-black/10">
            {lists[s.id].map((item) => (
              <SwipeRow
                key={item}
                value={item}
                label={rowLabel(item)}
                onDelete={() => {
                  setList(
                    s.id,
                    lists[s.id].filter((x) => x !== item),
                  )
                  toast(`${item} removed`)
                }}
              />
            ))}
          </Reorder.Group>
          {lists[s.id].length === 0 && <p className="px-6 pt-2 text-[13px] text-black/40">Nothing here yet — tap + to add.</p>}
        </section>
      ))}

      {/* Health Data */}
      <section className="mt-[34px] px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-title3 font-semibold text-ink">Health Data</h2>
          <button aria-label="Edit health data" onClick={() => toast('Tap any card to update it')} className="pressable -mr-1 p-1">
            <img src={iconEdit} alt="" className="h-[19px] w-[19px]" />
          </button>
        </div>
        <div className="mt-[8px] flex flex-col gap-[6px]">
          <HealthCard title="Chronic Conditions" values={health.chronic} icon={hChronic} size={[35, 36]} onPress={() => editHealth('chronic', 'Chronic Conditions', true)} />
          <HealthCard title="Allergies" values={health.allergies} icon={hAllergies} size={[28, 33]} onPress={() => editHealth('allergies', 'Allergies', true)} />
          <HealthCard title="Stress Level" values={[health.stress]} icon={hStress} size={[35, 27]} onPress={() => editHealth('stress', 'Stress Level', false)} />
          <HealthCard title="Sleep Quality" values={[health.sleep]} icon={hSleep} size={[28, 31]} onPress={() => editHealth('sleep', 'Sleep Quality', false)} />
          <HealthCard title="Mental Energy" values={[health.energy]} icon={hEnergy} size={[39, 36]} onPress={() => editHealth('energy', 'Mental Energy', false)} />
        </div>
        <p className="mt-[10px] text-[12px] leading-[16px] text-black/45">Demo profile. Everything stays on this device — nothing is sent or collected.</p>
      </section>

      {/* Demo kontrolleri (telefonda masaüstündeki "Restart demo" linkinin karşılığı) */}
      <section className="mt-[28px] px-6 pb-6">
        <h2 className="text-[16px] font-semibold text-ink">Demo</h2>
        <div className="mt-[8px] flex flex-col gap-[8px]">
          <button onClick={() => setOnboarded(false)} className="pressable h-[46px] rounded-[16px] border border-black/10 bg-bg px-[16px] text-left text-[15px] font-medium text-ink shadow-card">
            Replay onboarding
          </button>
          <button onClick={resetDemo} className="pressable h-[46px] rounded-[16px] border border-black/10 bg-bg px-[16px] text-left text-[15px] font-medium text-[#D9534F] shadow-card">
            Reset demo data
          </button>
        </div>
      </section>
    </ScreenLayout>
  )
}
