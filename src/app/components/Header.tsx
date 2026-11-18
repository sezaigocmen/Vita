/** Figma: Component/2/Header – 65px yüksek, mint zemin, sol başlık, sağda zil + avatar */
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import bell from '../../assets/icons/bell.svg'
import avatar from '../../assets/icons/avatar.svg'

export function Header({ title }: { title: string }) {
  const nav = useNav()
  return (
    <header className="relative z-10 shrink-0 bg-header" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="flex h-[65px] items-center justify-between pl-6 pr-6">
        <h1 className="text-title2 font-semibold text-ink">{title}</h1>
        <div className="flex items-center gap-[21px]">
          <button aria-label="Notifications" className="pressable -m-2 p-2" onClick={() => toast('You’re all caught up')}>
            <img src={bell} alt="" className="h-[31px] w-[26px]" />
          </button>
          <button aria-label="Profile" className="pressable -m-2 p-2" onClick={() => nav.setTab('profile')}>
            <img src={avatar} alt="" className="h-[28px] w-[24px]" />
          </button>
        </div>
      </div>
    </header>
  )
}
