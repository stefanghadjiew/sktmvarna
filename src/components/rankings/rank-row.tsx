import { useTranslation } from 'react-i18next'

import { FormDots } from '@/components/rankings/form-dots'
import { TOP_RANK_THRESHOLD, type RankedPlayer } from '@/data/rankings'
import { useFormatters } from '@/hooks/use-formatters'
import { cn } from '@/lib/utils'

export function RankRow({
  player,
  isFirst,
}: {
  player: RankedPlayer
  isFirst: boolean
}) {
  const { t } = useTranslation()
  const { percent } = useFormatters()
  const { rank, nameKey, initials, styleKey, tournaments, winRate, rating, delta, form } =
    player

  const meta = [
    t(styleKey),
    tournaments > 0
      ? t('rankings.tournaments', { count: tournaments })
      : t('rankings.noTournaments'),
    winRate === null
      ? null
      : t('rankings.winRate', { percent: percent.format(winRate) }),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <li
      className={cn(
        'hairline-b flex items-center gap-3 py-[11px] md:gap-4 md:py-3.5',
        isFirst && 'pt-0',
      )}
    >
      <span
        className={cn(
          'w-[22px] shrink-0 text-center text-xs font-bold',
          rank <= TOP_RANK_THRESHOLD ? 'text-brand-accent' : 'text-rank',
        )}
      >
        {rank}
      </span>

      <span
        aria-hidden="true"
        className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-secondary text-[11px] font-semibold text-chip-foreground"
      >
        {initials}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-semibold text-foreground md:text-sm">
          {t(nameKey)}
        </span>
        <span className="mt-px block text-[10.5px] text-rank-meta md:text-[11.5px]">
          {meta}
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span className="block text-sm font-bold text-foreground">
          {rating}
        </span>
        {delta > 0 ? (
          <span
            className="mt-px block text-[10px] font-semibold text-success"
            aria-label={t('rankings.delta.up', { count: delta })}
          >
            +{delta}
          </span>
        ) : (
          <span
            className="mt-px block text-[10px] font-semibold text-delta-flat"
            aria-label={t('rankings.delta.flat')}
          >
            —
          </span>
        )}
        <FormDots form={form} />
      </span>
    </li>
  )
}
