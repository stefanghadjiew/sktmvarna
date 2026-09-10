import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InitialsTile } from '@/components/trainers/initials-tile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { FeaturedTrainer } from '@/data/trainers'

export function FeaturedTrainerCard({
  trainer,
  onRequest,
}: {
  trainer: FeaturedTrainer
  onRequest?: () => void
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const { nameKey, initials, roleKey, badgeKey, stats, bioKey, tagKeys } =
    trainer

  /** The bio is stored as paragraphs joined by blank lines. */
  const paragraphs = t(bioKey).split('\n\n')
  const visibleParagraphs = expanded ? paragraphs : paragraphs.slice(0, 1)

  return (
    <Card className="mb-[26px] gap-0 rounded-[18px] border-[0.5px] p-[18px] shadow-none md:rounded-3xl md:p-8">
      <div className="mb-4 flex gap-3.5 md:mb-6 md:gap-5">
        <InitialsTile initials={initials} variant="brand" />
        <div>
          <h2 className="mb-[3px] text-[17px] font-semibold text-card-foreground md:text-2xl">
            {t(nameKey)}
          </h2>
          <p className="mb-2 text-xs text-muted-foreground">{t(roleKey)}</p>
          <Badge className="rounded-md bg-brand-badge-tint px-2 py-[3px] text-[10px] font-semibold text-brand-accent">
            {t(badgeKey)}
          </Badge>
        </div>
      </div>

      <dl className="mb-4 flex gap-2.5 md:mb-6 md:gap-4">
        {stats.map(({ value, labelKey }) => (
          <div
            key={labelKey}
            className="flex-1 rounded-xl bg-inset px-2 py-2.5 text-center md:py-4"
          >
            <dd className="text-lg font-bold text-card-foreground md:text-2xl">
              {value}
            </dd>
            <dt className="mt-0.5 text-[10px] text-meta md:text-[11px]">
              {t(labelKey)}
            </dt>
          </div>
        ))}
      </dl>

      <div className="mb-4 md:mb-6">
        <div className="max-w-[72ch] space-y-2.5 text-[12.5px] leading-[1.6] text-body md:space-y-3.5 md:text-sm md:leading-[1.75]">
          {visibleParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        {paragraphs.length > 1 && (
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="mt-2.5 text-[12px] font-semibold text-brand-accent"
          >
            {expanded ? t('trainers.readLess') : t('trainers.readMore')}
          </button>
        )}
      </div>

      <ul className="mb-[18px] flex flex-wrap gap-1.5 md:mb-6 md:gap-2">
        {tagKeys.map((tagKey) => (
          <li
            key={tagKey}
            className="rounded-full bg-chip px-2.5 py-[5px] text-[10.5px] text-chip-foreground md:px-3.5 md:py-1.5 md:text-xs"
          >
            {t(tagKey)}
          </li>
        ))}
      </ul>

      <Button
        type="button"
        onClick={onRequest}
        className="h-auto w-full rounded-xl bg-brand py-[13px] text-[13px] font-semibold text-white hover:bg-brand/90 md:w-auto md:self-start md:px-8 md:py-4 md:text-sm"
      >
        {t('trainers.requestSession')}
      </Button>
    </Card>
  )
}
