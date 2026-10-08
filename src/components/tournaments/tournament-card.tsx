import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useFormatters } from '@/hooks/use-formatters'
import { isRegistrationOpen, spotsLeft, type Tournament } from '@/lib/tournaments'

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const { t } = useTranslation()
  const formatters = useFormatters()
  const { id, name, startsAt, level, spotsTaken, spotsTotal } = tournament

  const start = new Date(startsAt)
  const left = spotsLeft(tournament)
  const open = isRegistrationOpen(tournament)

  return (
    <Link
      to={`/tournaments/${id}`}
      className="group flex h-full flex-col rounded-2xl border-[0.5px] border-border bg-card p-4 transition-colors hover:border-brand/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-accent capitalize">
            <time dateTime={startsAt}>
              {formatters.date.format(start)} · {formatters.time.format(start)}
            </time>
          </p>
          <p className="mt-1 text-[15px] leading-[1.3] font-semibold text-card-foreground md:text-base">
            {name}
          </p>
        </div>
        {level ? (
          <Badge variant="secondary" className="shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold">
            {level}
          </Badge>
        ) : null}
      </div>

      {spotsTotal ? (
        <div className="mt-auto">
          <Progress
            value={Math.round((spotsTaken / spotsTotal) * 100)}
            aria-label={t('tournaments.spotsLabel', { taken: spotsTaken, total: spotsTotal })}
            className="mb-2 h-[5px] rounded-[3px] bg-track"
          />
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className={open ? 'text-success' : 'text-card-hint'}>
              {left === 0
                ? t('tournaments.full')
                : open
                  ? t('tournaments.spotsLeft', { count: left ?? 0 })
                  : t(`tournaments.status.${tournament.status}`)}
            </span>
            <span className="flex items-center gap-0.5 font-semibold text-card-hint tabular-nums">
              {t('tournaments.spots', { taken: spotsTaken, total: spotsTotal })}
              <ChevronRight className="size-3.5 text-chevron transition-transform group-hover:translate-x-0.5" strokeWidth={1.8} />
            </span>
          </div>
        </div>
      ) : null}
    </Link>
  )
}
