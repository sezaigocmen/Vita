/** Demo'da gerçek karşılığı olmayan linkler (Terms, Privacy, Restore) için kısa bilgi sheet'i */
import type { NavApi } from '../../shell/navigation'
import { PrimaryButton } from './PrimaryButton'

export function openDemoNotice(nav: NavApi, title: string) {
  nav.openSheet((close) => (
    <div className="flex flex-col gap-3 px-6 pb-6 pt-1">
      <h2 className="text-title3 font-semibold">{title}</h2>
      <p className="text-body text-black/65">
        Vita is a portfolio demo. There are no real purchases, accounts or data collection — everything you enter stays on this device.
      </p>
      <PrimaryButton size="lg" tone="mint" className="mt-2" onClick={close}>
        Got it
      </PrimaryButton>
    </div>
  ))
}
