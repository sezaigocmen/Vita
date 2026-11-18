/** Figma: Onboarding-1 ve -7'deki figürlü organik arka plan (%60 opaklık) */
import bg from '../../assets/onboarding/bg-shapes.jpg'

/** box: Figma'daki dikdörtgenin 375×812 kare üzerindeki konumu [x, y, w, h] */
export function ShapesBackground({ box }: { box: [number, number, number, number] }) {
  const [x, y, w, h] = box
  return (
    <img
      src={bg}
      alt=""
      draggable={false}
      className="pointer-events-none absolute max-w-none object-cover opacity-60"
      style={{ left: `${(x / 375) * 100}%`, top: `${(y / 812) * 100}%`, width: `${(w / 375) * 100}%`, height: `${(h / 812) * 100}%` }}
    />
  )
}
