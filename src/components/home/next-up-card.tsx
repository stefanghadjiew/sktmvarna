import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { useFormatters } from '@/hooks/use-formatters'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Tournament } from '@/data/home'

export function NextUpCard({ tournament }: { tournament: Tournament }) {
  const { t } = useTranslation()
  const formatters = useFormatters()
  const { nameKey, startsAt, status, spotsTaken, spotsTotal, href } = tournament

  const startDate = new Date(startsAt)
  const filled = Math.round((spotsTaken / spotsTotal) * 100)
  const isOpen = status === 'open'
  const spotsLabel = t('tournaments.spots', {
    taken: spotsTaken,
    total: spotsTotal,
  })

  return (
    <section className="mb-auto md:max-w-[560px]">
      <h2 className="mb-3 text-[11px] font-semibold tracking-[1px] text-label uppercase md:mb-4 md:text-xs">
        {t('home.nextUp')}
      </h2>

      <Card className="gap-0 rounded-2xl border-[0.5px] p-4 shadow-none md:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="mb-[3px] text-[15px] font-semibold text-card-foreground md:text-[17px]">
              {t(nameKey)}
            </p>
            <p className="text-xs text-card-meta">
              <time dateTime={startsAt}>
                {formatters.date.format(startDate)} ·{' '}
                {formatters.time.format(startDate)}
              </time>
            </p>
          </div>
          <Badge
            variant={isOpen ? 'success' : 'secondary'}
            className="rounded-md px-2 py-1 text-[10px] font-semibold"
          >
            {t(`tournaments.status.${status}`)}
          </Badge>
        </div>

        <Progress
          value={filled}
          aria-label={spotsLabel}
          className="mb-2 h-[5px] rounded-[3px] bg-track"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-card-hint">{spotsLabel}</span>
          <Link
            to={href}
            className="rounded-sm text-xs font-semibold text-brand-accent transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {t('tournaments.register')} →
          </Link>
        </div>
      </Card>
    </section>
  )
}
