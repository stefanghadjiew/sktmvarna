import { useTranslation } from 'react-i18next'

import type { RatingChange } from '@/data/player-profile'

export function RatingChangeGrid({ entries }: { entries: RatingChange[] }) {
  const { t } = useTranslation()

  return (
    <dl className="grid grid-cols-2 gap-2">
      {entries.map(({ labelKey, value }) => (
        <div key={labelKey} className="rounded-xl bg-inset px-3 py-2.5">
          <dt className="mb-1 text-[9px] tracking-[0.5px] text-meta uppercase">
            {t(labelKey)}
          </dt>
          <dd className="text-base font-bold text-card-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
