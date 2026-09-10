import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { InitialsTile } from '@/components/trainers/initials-tile'
import type { Trainer } from '@/data/trainers'
import { cn } from '@/lib/utils'

export function TrainerList({
  trainers,
  className,
}: {
  trainers: Trainer[]
  className?: string
}) {
  const { t } = useTranslation()

  return (
    <section
      className={cn(
        'lg:rounded-2xl lg:border-[0.5px] lg:border-border lg:bg-card lg:p-5',
        className,
      )}
    >
      <h2 className="mb-3 text-[11px] font-semibold tracking-[1px] text-label uppercase md:text-xs">
        {t('trainers.alsoCoaching')}
      </h2>

      <ul>
        {trainers.map(
          ({ id, nameKey, initials, years, specialtyKey, href }, index) => (
            <li key={id} className="hairline-b last:border-b-0">
              <Link
                to={href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-1 py-[11px] transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  'hover:bg-row-hover active:bg-row-active',
                  index === 0 && 'pt-0',
                )}
              >
                <InitialsTile initials={initials} />
                <span className="flex-1">
                  <span className="block text-[13px] font-medium text-foreground">
                    {t(nameKey)}
                  </span>
                  <span className="mt-px block text-[11px] text-meta">
                    {t('trainers.experience', { count: years })} ·{' '}
                    {t(specialtyKey)}
                  </span>
                </span>
                <ChevronRight
                  className="size-4 shrink-0 text-chevron"
                  strokeWidth={1.8}
                />
              </Link>
            </li>
          ),
        )}
      </ul>
    </section>
  )
}
