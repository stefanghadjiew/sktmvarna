import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { hoursOn } from '@/data/complex'
import { useFormatters } from '@/hooks/use-formatters'
import { DURATIONS, freeTablesFor, startTimesFor, type Booking, type Duration } from '@/lib/bookings'
import { addDays, fromISODate, today } from '@/lib/dates'
import { cn } from '@/lib/utils'

/** How far ahead the booking flow lets people pick a day. */
export const BOOKING_HORIZON_DAYS = 21

export function FieldLabel({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <p id={id} className="mb-2 text-[11px] font-semibold tracking-[1px] text-label uppercase md:text-xs">
      {children}
    </p>
  )
}

const chip =
  'rounded-xl border-[0.5px] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40'
const chipIdle = 'border-border bg-card text-foreground hover:border-brand/40'
const chipActive = 'border-brand bg-brand text-white'

export function DatePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (date: string) => void
}) {
  const { t } = useTranslation()
  const { weekday, dayOfMonth, longDate } = useFormatters()
  const first = today()
  const days = Array.from({ length: BOOKING_HORIZON_DAYS }, (_, index) => addDays(first, index))

  return (
    <div role="radiogroup" aria-labelledby="reserve-date-label">
      <FieldLabel id="reserve-date-label">{t('reserve.date')}</FieldLabel>
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
        {days.map((day) => {
          const date = fromISODate(day)
          const selected = day === value
          const closed = hoursOn(day) === null
          return (
            <button
              key={day}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={longDate.format(date)}
              disabled={closed}
              onClick={() => onChange(day)}
              className={cn(chip, 'flex w-[52px] shrink-0 flex-col items-center py-2', selected ? chipActive : chipIdle)}
            >
              <span className={cn('text-[10px] uppercase', selected ? 'text-white/80' : 'text-meta')}>
                {weekday.format(date)}
              </span>
              <span className="text-[17px] font-semibold tabular-nums">{dayOfMonth.format(date)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function DurationPicker({
  value,
  onChange,
}: {
  value: Duration
  onChange: (duration: Duration) => void
}) {
  const { t } = useTranslation()

  return (
    <div role="radiogroup" aria-labelledby="reserve-duration-label">
      <FieldLabel id="reserve-duration-label">{t('reserve.duration')}</FieldLabel>
      <div className="grid grid-cols-3 gap-1.5 sm:max-w-[360px]">
        {DURATIONS.map((duration) => (
          <button
            key={duration}
            type="button"
            role="radio"
            aria-checked={duration === value}
            onClick={() => onChange(duration)}
            className={cn(chip, 'py-2.5 text-[14px] font-semibold', duration === value ? chipActive : chipIdle)}
          >
            {t('reserve.minutes', { count: duration })}
          </button>
        ))}
      </div>
    </div>
  )
}

export function TimePicker({
  date,
  duration,
  bookings,
  value,
  onChange,
  ignoreId,
}: {
  date: string
  duration: Duration
  bookings: Booking[]
  value: string | null
  onChange: (time: string) => void
  ignoreId?: string
}) {
  const { t } = useTranslation()
  const times = startTimesFor(date, duration)

  return (
    <div role="radiogroup" aria-labelledby="reserve-time-label">
      <FieldLabel id="reserve-time-label">{t('reserve.time')}</FieldLabel>
      {hoursOn(date) === null ? (
        <p className="text-[14px] text-muted-foreground">{t('reserve.closedDay')}</p>
      ) : times.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">{t('reserve.noTimes')}</p>
      ) : (
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-8">
          {times.map((time) => {
            const free = freeTablesFor(bookings, { date, start: time, duration }, ignoreId).length
            const selected = time === value
            return (
              <button
                key={time}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={free === 0}
                onClick={() => onChange(time)}
                className={cn(chip, 'flex flex-col items-center py-2', selected ? chipActive : chipIdle)}
              >
                <span className="text-[14px] font-semibold tabular-nums">{time}</span>
                <span className={cn('text-[10px]', selected ? 'text-white/80' : free > 0 ? 'text-success' : 'text-meta')}>
                  {free > 0 ? t('reserve.freeCount', { count: free }) : t('reserve.none')}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
