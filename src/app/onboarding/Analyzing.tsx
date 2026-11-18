/** Figma: Onboarding-7 – cevaplar analiz ediliyor, %100 olunca ana sayfaya geçer */
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { useVita } from '../store'
import { ShapesBackground } from './ShapesBackground'
import logo from '../../assets/onboarding/logo-small.svg'

export function Analyzing() {
  const setOnboarded = useVita((s) => s.setOnboarded)
  const progress = useMotionValue(0)
  const width = useTransform(progress, (v) => `${v}%`)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const unsub = progress.on('change', (v) => setPct(Math.round(v)))
    const controls = animate(progress, 100, { duration: 3.2, ease: [0.45, 0, 0.2, 1] })
    controls.then(() => setTimeout(() => setOnboarded(true), 450))
    return () => {
      unsub()
      controls.stop()
    }
  }, [progress, setOnboarded])

  return (
    <div className="relative h-full overflow-hidden bg-bg">
      <ShapesBackground box={[-43, 0, 443, 812]} />
      <div className="relative flex h-full flex-col items-center justify-center px-6 pb-[60px]">
        <p className="max-w-[291px] text-center text-[20px] leading-[24px] text-ink">
          “Almost ready! Vita is analyzing your answers to create your personalized health journey.”
        </p>
        <motion.img
          src={logo}
          alt=""
          className="mt-[25px] h-[34px] w-[52px]"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="mt-[25px] h-[13px] w-full overflow-hidden rounded-[6px] bg-ink">
          <motion.div className="h-full rounded-[6px] bg-brand" style={{ width }} />
        </div>
        <p className="mt-[13px] text-[25px] font-medium leading-[30px] text-ink tabular-nums">{pct}%</p>
      </div>
    </div>
  )
}
