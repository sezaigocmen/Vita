/** Figma: Onboarding-1 – "Ready to Begin?" */
import { motion } from 'motion/react'
import { useNav } from '../../shell/navigation'
import { PrimaryButton } from '../components/PrimaryButton'
import { ShapesBackground } from './ShapesBackground'

export function ReadyToBegin() {
  const nav = useNav()
  return (
    <div className="relative h-full overflow-hidden bg-bg">
      <ShapesBackground box={[-41, -24, 456, 836]} />

      <div className="relative flex h-full flex-col px-6" style={{ paddingTop: 'calc(var(--safe-top) + 2px)', paddingBottom: 'calc(max(var(--safe-bottom), 20px) + 14px)' }}>
        <div className="flex h-6 items-center justify-end">
          <button onClick={() => nav.push('ob-analyzing')} className="pressable -my-2 py-2 text-[13px] font-light text-ink">
            Skip
          </button>
        </div>

        <motion.h1
          className="mt-[29px] pl-[15px] text-[60px] font-semibold leading-[72px] text-ink"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
        >
          Ready
          <br />
          to
          <br />
          Begin?
        </motion.h1>

        <div className="flex-1" />

        <p className="mb-[26px] text-center text-[20px] leading-[24px] text-ink">Let’s personalize your journey.</p>
        <PrimaryButton onClick={() => nav.push('ob-question', { index: 0 })}>Start</PrimaryButton>
      </div>
    </div>
  )
}
