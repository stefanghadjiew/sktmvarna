import { useTranslation } from 'react-i18next'

import { openingHours, type OpeningHours as Hours } from '@/data/complex'
import { useFormatters } from '@/hooks/use-formatters'

/** Monday-first, as people read a week here. */
const WEEK = [1, 2, 3, 4, 5, 6, 0]

const same = (a: Hours, b: Hours) =>
  a === b || (a !== null && b !== null && a.open === b.open && a.close === b.close)

/**
 * Runs of days with the same hours collapse into one row ("Mon–Sun"), so a
 * hall open the same hours every day reads as a single line.
 */
export function OpeningHoursList() {
  const { t } = useTranslation()
  const { weekday } = useFormatters()

  // 2024-01-01 was a Monday — any fixed week works for naming the days.
  const dayName = (day: number) => weekday.format(new Date(2024, 0, day === 0 ? 7 : day))

  const runs: { from: number; to: number; hours: Hours }[] = []
  for (const day of WEEK) {
    const last = runs.at(-1)
    if (last && same(last.hours, openingHours[day])) last.to = day
    else runs.push({ from: day, to: day, hours: openingHours[day] })
  }

  return (
    <dl className="flex flex-col gap-1.5 text-[14px]">
      {runs.map(({ from, to, hours }) => (
        <div key={from} className="flex justify-between gap-4">
          <dt className="text-muted-foreground capitalize">
            {from === to ? dayName(from) : `${dayName(from)}–${dayName(to)}`}
          </dt>
          <dd className="font-semibold text-foreground tabular-nums">
            {hours ? t('complex.hours.range', hours) : t('complex.hours.closed')}
          </dd>
        </div>
      ))}
    </dl>
  )
}
