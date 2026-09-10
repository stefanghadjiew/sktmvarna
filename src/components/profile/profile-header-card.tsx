import { useTranslation } from 'react-i18next'

import { InitialsTile } from '@/components/trainers/initials-tile'
import type { PlayerProfile } from '@/data/player-profile'
import { useFormatters } from '@/hooks/use-formatters'

export function ProfileHeaderCard({ profile }: { profile: PlayerProfile }) {
  const { t } = useTranslation()
  const { percent } = useFormatters()
  const { nameKey, initials, stats } = profile

  return (
    <section className="mb-4 rounded-[18px] border-[0.5px] border-border bg-card p-[18px] md:mb-6 md:rounded-3xl md:p-8">
      <div className="mb-3.5 flex items-start justify-between gap-3">
        <span className="text-[10px] font-bold tracking-[1px] text-brand-accent uppercase">
          {t('profile.publicBadge')}
        </span>
        <InitialsTile
          initials={initials}
          variant="brand"
          className="size-[46px] rounded-full text-base"
        />
      </div>

      <h1 className="mb-2.5 text-[22px] font-bold text-card-foreground md:text-[34px]">
        {t(nameKey)}
      </h1>
      <p className="mb-4 max-w-[60ch] text-xs leading-[1.5] text-muted-foreground md:mb-6 md:text-sm md:leading-[1.6]">
        {t('profile.description')}
      </p>

      <dl className="flex gap-2 md:max-w-[560px] md:gap-4">
        {stats.map(({ labelKey, value, isPercent }) => (
          <div
            key={labelKey}
            className="flex-1 rounded-xl bg-inset px-1.5 py-2.5 text-center md:py-4"
          >
            <dd className="text-base font-bold text-card-foreground md:text-2xl">
              {isPercent ? percent.format(value) : value}
            </dd>
            <dt className="mt-0.5 text-[9px] tracking-[0.5px] text-meta uppercase">
              {t(labelKey)}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  )
}
