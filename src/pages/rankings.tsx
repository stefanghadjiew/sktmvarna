import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'
import { PlayerSearch } from '@/components/rankings/player-search'
import { RankRow } from '@/components/rankings/rank-row'
import { RatingExplainer } from '@/components/rankings/rating-explainer'
import { rankedPlayers } from '@/data/rankings'

export function Rankings() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  // Names live in the translation files, so filtering has to run on the
  // translated name rather than the key.
  const visiblePlayers = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    if (!needle) return rankedPlayers
    return rankedPlayers.filter((player) =>
      t(player.nameKey).toLocaleLowerCase().includes(needle),
    )
  }, [query, t])

  return (
    <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
      {/* A table of ranks stops being readable long before 1440px, so the
          page keeps its own cap and hands the extra width to a sidebar. */}
      <div className="mx-auto max-w-[1120px] lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <PageIntro
            eyebrow={t('rankings.eyebrow')}
            title={t('rankings.title')}
            subtitle={t('rankings.subtitle')}
            className="mb-4 md:mb-6"
          />
          <RatingExplainer />
          <PlayerSearch value={query} onChange={setQuery} />
        </div>

        {visiblePlayers.length > 0 ? (
          <ul aria-label={t('rankings.listLabel')} className="pb-1">
            {visiblePlayers.map((player, index) => (
              <RankRow key={player.id} player={player} isFirst={index === 0} />
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-xs text-muted-foreground">
            {t('rankings.noResults')}
          </p>
        )}
      </div>
    </AppShell>
  )
}
