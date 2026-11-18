/** Figma: Introduction-1 – Welcome */
import { motion } from 'motion/react'
import { useNav } from '../../shell/navigation'
import { PrimaryButton } from '../components/PrimaryButton'
import logo from '../../assets/icons/logo.svg'
import stars from '../../assets/intro/stars.svg'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.32, 0.72, 0, 1] as const },
})

export function Welcome() {
  const nav = useNav()
  return (
    <div
      className="flex h-full flex-col items-center bg-bg px-6 text-center"
      style={{ paddingTop: 'calc(var(--safe-top) + 22px)', paddingBottom: 'calc(max(var(--safe-bottom), 20px) + 14px)' }}
    >
      <motion.div {...fadeUp(0.05)} className="flex flex-col items-center">
        <p className="text-[25px] leading-[30px] text-ink">Welcome!</p>
        <h1 className="mt-4 text-large font-semibold text-ink">Vita</h1>
        <p className="mt-4 w-[255px] text-[15px] italic leading-[18px] text-ink">Your personal partner for a healthier lifestyle.</p>
      </motion.div>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <motion.img
          src={logo}
          alt="Vita logo"
          className="w-[246px] max-w-full"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>

      <motion.div {...fadeUp(0.35)} className="flex flex-col items-center">
        <p className="text-[18px] leading-[21px] text-ink">2M + Healthy</p>
        <p className="text-[15px] leading-[18px] text-brand">Vita Users</p>
        <img src={stars} alt="5 stars" className="mt-[15px] h-[17px] w-[87px]" />
      </motion.div>

      <motion.div {...fadeUp(0.45)} className="mt-[32px] w-full">
        <PrimaryButton onClick={() => nav.push('features')}>Let’s Go</PrimaryButton>
      </motion.div>
    </div>
  )
}
