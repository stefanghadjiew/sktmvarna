import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { FacilitiesList } from '@/components/complex/facilities-list'
import { OpeningHoursList } from '@/components/complex/opening-hours'
import { PhotoStrip } from '@/components/gallery/photo-strip'
import { BottomNav } from '@/components/home/bottom-nav'
import { HomeHero } from '@/components/home/home-hero'
import { TodayAvailability } from '@/components/home/today-availability'
import { TopBar } from '@/components/home/top-bar'
import { AppShell } from '@/components/layout/app-shell'
import { SectionHeading } from '@/components/section-heading'
import { TournamentCard } from '@/components/tournaments/tournament-card'
import { Button } from '@/components/ui/button'
import { photoSelection } from '@/data/gallery'
import { usePageMeta } from '@/hooks/use-page-meta'
import { upcomingTournaments } from '@/lib/tournaments'

/** Players, tables and tournament evenings, mixed across the gallery folders. */
const atmosphere = photoSelection('home-atmosphere', [
  ['tournaments', 4],
  ['hall', 5],
  ['tournaments', 9],
  ['kids', 0],
  ['hall', 9],
  ['tournaments', 16],
  ['hall', 12],
])

/**
 * The front page sells the complex — tables, booking, tournaments — to people
 * who want to play. The club gets its own block at the end and its own page.
 */
export function Home() {
  const { t } = useTranslation()
  usePageMeta('home')
  const tournaments = upcomingTournaments().slice(0, 3)

  return (
    <AppShell header={<TopBar />} nav={<BottomNav />}>
      <HomeHero />
      <TodayAvailability />

      {tournaments.length > 0 ? (
        <section className="mb-10 md:mb-16">
          <SectionHeading action={{ to: '/tournaments', label: t('home.tournaments.seeAll') }}>
            {t('home.tournaments.heading')}
          </SectionHeading>
          <ul className="grid gap-3 md:grid-cols-3 md:gap-5">
            {tournaments.map((tournament) => (
              <li key={tournament.id}>
                <TournamentCard tournament={tournament} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mb-10 md:mb-16">
        <SectionHeading action={{ to: '/gallery', label: t('home.atmosphere.seeAll') }}>
          {t('home.atmosphere.heading')}
        </SectionHeading>
        <PhotoStrip section={atmosphere} />
      </section>

      <section className="mb-10 grid gap-3 md:mb-16 md:grid-cols-3 md:gap-5">
        <div className="rounded-2xl border-[0.5px] border-border bg-card p-5 md:col-span-2 md:p-6">
          <SectionHeading action={{ to: '/hall', label: t('home.complex.more') }}>
            {t('home.complex.heading')}
          </SectionHeading>
          <div className="grid gap-6 sm:grid-cols-2">
            <FacilitiesList />
            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-[1px] text-label uppercase">
                {t('complex.hours.heading')}
              </p>
              <OpeningHoursList />
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border-[0.5px] border-border bg-card p-5 md:p-6">
          <SectionHeading>{t('home.prices.heading')}</SectionHeading>
          <p className="mb-5 text-[14px] leading-[1.55] text-muted-foreground">{t('home.prices.body')}</p>
          <Button asChild variant="outline" className="mt-auto self-start">
            <Link to="/prices">
              {t('home.prices.cta')}
              <ArrowRight className="size-4" strokeWidth={1.8} />
            </Link>
          </Button>
        </div>
      </section>

      {/* The club is a separate organisation that trains here — kept visibly
          apart from the hall's own blocks above. */}
      <section className="rounded-2xl bg-inset p-5 md:p-8">
        <p className="mb-2 text-[11px] font-semibold tracking-[1.2px] text-brand-accent uppercase md:text-xs">
          {t('home.club.eyebrow')}
        </p>
        <h2 className="text-[22px] leading-[1.2] font-bold text-foreground md:text-[30px]">
          {t('home.club.title')}
        </h2>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-[1.6] text-muted-foreground md:text-[15px]">
          {t('home.club.body')}
        </p>
        <Button asChild className="mt-5 bg-foreground text-background hover:bg-foreground/90">
          <Link to="/club">
            {t('home.club.cta')}
            <ArrowRight className="size-4" strokeWidth={1.8} />
          </Link>
        </Button>
      </section>
    </AppShell>
  )
}
