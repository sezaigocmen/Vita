/** Profile parçaları: kaydırarak silinen + sürüklenerek sıralanan satır, seçim paneli, profil düzenleme */
import { animate, motion, Reorder, useDragControls, useMotionValue } from 'motion/react'
import { useState } from 'react'
import { PrimaryButton } from '../components/PrimaryButton'
import type { Profile } from '../data/profile'
import { OPTIONS } from '../data/profile'
import iconTrash from '../../assets/profile/icon-trash.svg'

const DELETE_W = 56

/** Figma: Component 18 – sola kaydırınca kırmızı sil butonu, ≡ tutamaçla sıralama */
export function SwipeRow({ value, label, onDelete }: { value: string; label: string; onDelete: () => void }) {
  const controls = useDragControls()
  const x = useMotionValue(0)
  const snap = (open: boolean) => animate(x, open ? -DELETE_W : 0, { type: 'spring', stiffness: 500, damping: 40 })

  return (
    <Reorder.Item value={value} dragListener={false} dragControls={controls} className="relative border-b border-black/10 bg-bg" style={{ position: 'relative' }}>
      <button
        aria-label={`Delete ${label}`}
        onClick={onDelete}
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-[#ED6262]"
        style={{ width: DELETE_W }}
      >
        <img src={iconTrash} alt="" className="h-[16px] w-[15px]" />
      </button>
      <motion.div
        className="relative flex h-[36px] items-center bg-bg pl-6 pr-6"
        style={{ x, touchAction: 'pan-y' }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -DELETE_W, right: 0 }}
        dragElastic={0.08}
        onDragEnd={(_, i) => snap(i.offset.x < -DELETE_W / 2 || i.velocity.x < -300)}
        onTap={() => snap(x.get() > -DELETE_W / 2)}
      >
        <span
          aria-label="Reorder"
          className="-ml-2 flex h-full w-[30px] shrink-0 cursor-grab items-center pl-2 active:cursor-grabbing"
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => {
            e.stopPropagation()
            controls.start(e)
          }}
        >
          <span className="flex w-[10px] flex-col gap-[2px]">
            <span className="h-px bg-ink" />
            <span className="h-px bg-ink" />
          </span>
        </span>
        <span className="text-[15px] leading-[18px] text-ink">{label}</span>
      </motion.div>
    </Reorder.Item>
  )
}

/** Tek ya da çoklu seçim paneli (sheet içeriği) */
export function ChoiceSheet({
  title,
  options,
  selected,
  multi,
  onDone,
  hint,
}: {
  title: string
  options: string[]
  selected: string[]
  multi?: boolean
  onDone: (values: string[]) => void
  hint?: string
}) {
  const [values, setValues] = useState(selected)
  const pick = (o: string) => {
    if (!multi) return onDone([o])
    if (o === 'None') return setValues(values.includes('None') ? [] : ['None'])
    const v = values.filter((x) => x !== 'None')
    setValues(v.includes(o) ? v.filter((x) => x !== o) : [...v, o])
  }
  return (
    <div className="flex flex-col gap-3 px-6 pb-6 pt-1">
      <div>
        <h2 className="text-title3 font-semibold">{title}</h2>
        {hint && <p className="mt-1 text-[13px] text-black/50">{hint}</p>}
      </div>
      <div className="flex flex-wrap gap-[8px]">
        {options.map((o) => {
          const on = values.includes(o)
          return (
            <button
              key={o}
              onClick={() => pick(o)}
              className={`pressable h-[38px] rounded-full border px-[16px] text-[15px] font-medium transition-colors ${on ? 'border-brand bg-brand text-white' : 'border-black/15 bg-bg text-ink shadow-card'}`}
            >
              {o}
            </button>
          )
        })}
      </div>
      {multi && (
        <PrimaryButton size="lg" className="mt-2" onClick={() => onDone(values)}>
          Done
        </PrimaryButton>
      )}
    </div>
  )
}

/** Profil kartı düzenleme formu */
export function EditProfileSheet({ profile, onSave }: { profile: Profile; onSave: (p: Profile) => void }) {
  const [p, setP] = useState(profile)
  const field = (label: string, input: React.ReactNode) => (
    <label className="flex items-center justify-between gap-4 border-b border-black/10 py-[10px]">
      <span className="text-[15px] font-medium text-ink">{label}</span>
      {input}
    </label>
  )
  const num = (key: 'age' | 'height' | 'weight', unit: string, min: number, max: number) => (
    <span className="flex items-center gap-1">
      <input
        type="number"
        inputMode="numeric"
        value={p[key]}
        min={min}
        max={max}
        onChange={(e) => setP({ ...p, [key]: Math.max(0, Math.min(max, Number(e.target.value) || 0)) })}
        className="w-[70px] rounded-[10px] bg-black/[0.04] px-2 py-1 text-right text-[16px] outline-none"
      />
      {unit && <span className="w-[24px] text-[14px] text-black/50">{unit}</span>}
    </span>
  )
  const chips = (key: 'gender' | 'blood', opts: string[]) => (
    <div className="flex flex-wrap gap-[6px] pb-[10px]">
      {opts.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => setP({ ...p, [key]: o })}
          className={`pressable h-[32px] rounded-full border px-[12px] text-[14px] ${p[key] === o ? 'border-brand bg-brand text-white' : 'border-black/15 text-ink'}`}
        >
          {o}
        </button>
      ))}
    </div>
  )
  return (
    <form
      className="flex flex-col px-6 pb-6 pt-1"
      onSubmit={(e) => {
        e.preventDefault()
        onSave({ ...p, name: p.name.trim() || 'Meloni Sparks' })
      }}
    >
      <h2 className="text-title3 font-semibold">Edit profile</h2>
      <p className="mt-1 text-[13px] text-black/50">Demo profile — changes stay on this device.</p>
      {field(
        'Name',
        <input value={p.name} maxLength={28} onChange={(e) => setP({ ...p, name: e.target.value })} className="w-[180px] rounded-[10px] bg-black/[0.04] px-2 py-1 text-right text-[16px] outline-none" />,
      )}
      {field('Age', num('age', '', 13, 100))}
      <p className="pt-[10px] text-[15px] font-medium text-ink">Gender</p>
      {chips('gender', OPTIONS.gender)}
      {field('Height', num('height', 'cm', 100, 230))}
      {field('Weight', num('weight', 'kg', 30, 250))}
      <p className="pt-[10px] text-[15px] font-medium text-ink">Blood Type</p>
      {chips('blood', OPTIONS.blood)}
      <PrimaryButton size="lg" type="submit" className="mt-3">
        Save
      </PrimaryButton>
    </form>
  )
}

/** Figma: Component/Card/Health Data (327×72) */
export function HealthCard({ title, values, icon, size, onPress }: { title: string; values: string[]; icon: string; size: [number, number]; onPress: () => void }) {
  return (
    <motion.button
      layout
      onClick={onPress}
      className="pressable flex min-h-[72px] w-full items-center justify-between rounded-card border border-black/10 bg-bg py-[10px] pl-[12px] pr-[20px] text-left shadow-card"
    >
      <span className="flex flex-col">
        <span className="text-[16px] font-medium leading-[19px] text-ink">{title}</span>
        <span className="mt-[5px] flex flex-col gap-[2px] pl-[13px]">
          {values.map((v) => (
            <span key={v} className="text-[13px] leading-[15px] text-ink">
              {v}
            </span>
          ))}
        </span>
      </span>
      <img src={icon} alt="" style={{ width: size[0], height: size[1] }} />
    </motion.button>
  )
}
