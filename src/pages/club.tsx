import { ArrowRight, CalendarRange, GraduationCap, Medal, UsersRound } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { PhotoStrip } from '@/components/gallery/photo-strip'
import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import { photoSelection } from '@/data/gallery'
import { usePageMeta } from '@/hooks/use-page-meta'

const academyPhotos = photoSelection('club-page', [
  ['kids', 1],
  ['kids', 0],
  ['kids', 2],
  ['kids', 4],
  ['kids', 6],
])

const sections = [
  { id: 'school', icon: GraduationCap },
  { id: 'competitors', icon: UsersRound },
  { id: 'championships', icon: Medal },
  { id: 'calendar', icon: CalendarRange },
] as const

/**
 * /club — СКТМ „Варна“, the sports club, kept on its own page so it isn't
 * confused with the hall it trains in.
 */
export function Club() {
  const { t } = useTranslation()
  usePageMeta('club')

  return (
    <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
      <PageIntro
        eyebrow={t('club.eyebrow')}
        title={<Trans i18nKey="club.title" components={{ accent: <span className="text-brand" /> }} />}
        subtitle={t('club.subtitle')}
      />

      <p className="mb-8 max-w-[68ch] text-[14px] leading-[1.65] text-foreground md:mb-12 md:text-[16px]">
        {t('club.about')}
      </p>

      <ul className="mb-8 grid gap-3 sm:grid-cols-2 md:mb-14 md:gap-5">
        {sections.map(({ id, icon: Icon }) => (
          <li key={id} className="flex flex-col rounded-2xl border-[0.5px] border-border bg-card p-5 md:p-6">
            <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand-tint">
              <Icon className="size-5 text-brand-icon" strokeWidth={1.8} />
            </span>
            <h2 className="text-[17px] font-semibold text-card-foreground">{t(`club.sections.${id}.heading`)}</h2>
            <p className="mt-1.5 text-[14px] leading-[1.6] text-card-meta">{t(`club.sections.${id}.body`)}</p>
            {id === 'calendar' ? (
              <Link to="/tournaments" className="mt-4 text-[13px] font-semibold text-brand-accent hover:opacity-80">
                {t('club.sections.calendar.cta')} →
              </Link>
            ) : null}
          </li>
        ))}
      </ul>

      <section className="mb-8 md:mb-14">
        <SectionHeading action={{ to: '/gallery', label: t('home.atmosphere.seeAll') }}>
          {t('club.photosHeading')}
        </SectionHeading>
        <PhotoStrip section={academyPhotos} />
      </section>

      <Button asChild size="lg" className="rounded-xl bg-brand text-white hover:bg-brand-accent">
        <Link to="/trainers">
          {t('club.trainersCta')}
          <ArrowRight className="size-4" strokeWidth={1.8} />
        </Link>
      </Button>
    </AppShell>
  )
}
