import { useTranslation } from 'react-i18next'

import { hourlyTableRate } from '@/data/complex'
import { useFormatters } from '@/hooks/use-formatters'
import type { Duration } from '@/lib/bookings'
import { fromISODate, fromMinutes, toMinutes } from '@/lib/dates'
import { cn } from '@/lib/utils'

export function BookingSummary({
  date,
  start,
  duration,
  tableId,
  className,
}: {
  date: string
  start: string | null
  duration: Duration
  tableId: number | null
  className?: string
}) {
  const { t } = useTranslation()
  const { longDate, euro } = useFormatters()
  const rate = hourlyTableRate()

  const rows = [
    { label: t('reserve.date'), value: longDate.format(fromISODate(date)) },
    {
      label: t('reserve.time'),
      value: start ? `${start}–${fromMinutes(toMinutes(start) + duration)}` : '—',
    },
    { label: t('reserve.duration'), value: t('reserve.minutes', { count: duration }) },
    { label: t('reserve.steps.table'), value: tableId ? t('reserve.table', { id: tableId }) : '—' },
    {
      label: t('reserve.summary.price'),
      value:
        rate === null
          ? t('reserve.summary.priceOnRequest')
          : t('reserve.summary.estimate', { amount: euro.format((rate * duration) / 60) }),
    },
  ]

  return (
    <section className={cn('rounded-2xl border-[0.5px] border-border bg-card p-4 md:p-5', className)}>
      <h2 className="mb-3 text-[11px] font-semibold tracking-[1px] text-label uppercase">
        {t('reserve.summary.heading')}
      </h2>
      <dl>
        {rows.map(({ label, value }, index) => (
          <div key={label} className={cn('flex justify-between gap-3 py-2 text-[13px]', index > 0 && 'kv-line-t')}>
            <dt className="text-meta">{label}</dt>
            <dd className="text-right font-semibold text-card-foreground first-letter:uppercase">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
