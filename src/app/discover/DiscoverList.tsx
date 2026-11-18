/** "See All": bir Discover bölümünün tüm kartları ızgara halinde */
import { useNav, type ScreenProps } from '../../shell/navigation'
import { BackButton, ScreenLayout } from '../components/ScreenLayout'
import { SECTION_TITLES, SectionCards, type SectionId } from './SectionCards'

export function DiscoverList({ params }: ScreenProps<{ section: SectionId }>) {
  const nav = useNav()
  return (
    <ScreenLayout title="Discover">
      <div className="px-6 pt-[12px]">
        <BackButton onClick={nav.pop} />
        <h1 className="mt-[2px] text-title2 font-semibold text-ink">{SECTION_TITLES[params.section]}</h1>
      </div>
      <div className="mt-[14px] grid grid-cols-3 justify-items-center gap-y-[12px] px-[18px] pb-6">
        <SectionCards section={params.section} />
      </div>
    </ScreenLayout>
  )
}
