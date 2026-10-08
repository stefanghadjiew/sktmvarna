import { Trans, useTranslation } from 'react-i18next'

import { PhotoStrip } from '@/components/gallery/photo-strip'
import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'
import { SectionHeading } from '@/components/section-heading'
import { TournamentCard } from '@/components/tournaments/tournament-card'
import { photoSelection } from '@/data/gallery'
import { useFormatters } from '@/hooks/use-formatters'
import { usePageMeta } from '@/hooks/use-page-meta'
import { tournamentsSyncedAt, upcomingTournaments } from '@/lib/tournaments'

const tournamentPhotos = photoSelection('tournaments-page', [
  ['tournaments', 2],
  ['tournaments', 7],
  ['tournaments', 12],
  ['tournaments', 20],
  ['tournaments', 27],
])

export function Tournaments() {
  const { t } = useTranslation()
  const { longDate } = useFormatters()
  usePageMeta('tournaments')
  const tournaments = upcomingTournaments()

  return (
    <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
      <PageIntro
        eyebrow={t('tournaments.eyebrow')}
        title={<Trans i18nKey="tournaments.title" components={{ accent: <span className="text-brand" /> }} />}
        subtitle={t('tournaments.subtitle')}
      />

      {tournaments.length === 0 ? (
        <p className="rounded-2xl border-[0.5px] border-border bg-card p-6 text-[14px] text-muted-foreground">
          {t('tournaments.empty')}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {tournaments.map((tournament) => (
            <li key={tournament.id}>
              <TournamentCard tournament={tournament} />
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-[11px] text-meta">
        {t('tournaments.source', { date: longDate.format(new Date(tournamentsSyncedAt)) })}
      </p>

      <section className="mt-10 md:mt-16">
        <SectionHeading action={{ to: '/gallery', label: t('home.atmosphere.seeAll') }}>
          {t('gallery.sections.tournaments')}
        </SectionHeading>
        <PhotoStrip section={tournamentPhotos} />
      </section>
    </AppShell>
  )
}
