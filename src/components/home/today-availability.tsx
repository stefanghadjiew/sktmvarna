import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { DemoNotice } from '@/components/demo-notice'
import { Button } from '@/components/ui/button'
import { TABLE_COUNT, hoursOn } from '@/data/complex'
import { useDayBookings } from '@/hooks/use-day-bookings'
import { freeCountAt, isDemoBackend } from '@/lib/bookings'
import { addDays, fromMinutes, nowMinutes, today, toMinutes } from '@/lib/dates'
import { cn } from '@/lib/utils'

/** Re-reads the clock each minute so "right now" doesn't go stale on screen. */
function useNowMinutes() {
  const [now, setNow] = useState(nowMinutes)
  useEffect(() => {
    const timer = window.setInterval(() => setNow(nowMinutes()), 60_000)
    return () => window.clearInterval(timer)
  }, [])
  return now
}

/**
 * The live block under the hero: how many of the 14 tables are free at this
 * moment, and an hour-by-hour strip for the rest of today, each hour linking
 * straight into the booking flow at that time.
 */
export function TodayAvailability() {
  const { t } = useTranslation()
  const date = today()
  const now = useNowMinutes()
  const { bookings, loading } = useDayBookings(date)
  const hours = hoursOn(date)

  const open = hours ? toMinutes(hours.open) : 0
  const close = hours ? toMinutes(hours.close) : 0
  const isOpenNow = hours !== null && now >= open && now < close
  const freeNow = freeCountAt(bookings, date, now)

  // Whole hours still ahead today, starting with the current one.
  const slots: { minute: number; free: number }[] = []
  if (hours) {
    for (let minute = Math.max(open, Math.floor(now / 60) * 60); minute < close; minute += 60) {
      slots.push({ minute, free: freeCountAt(bookings, date, Math.max(minute, now)) })
    }
  }

  let status
  if (!hours) status = t('home.today.closedToday')
  else if (now < open) status = t('home.today.opensAt', { time: hours.open })
  else if (!isOpenNow) status = t('home.today.afterHours')
  else
    status = (
      <Trans
        i18nKey="home.today.freeNow"
        values={{ free: freeNow, total: TABLE_COUNT }}
        components={{ strong: <strong className="text-[28px] font-bold text-foreground md:text-[34px]" /> }}
      />
    )

  return (
    <section
      aria-labelledby="today-heading"
      aria-busy={loading}
      className="mb-10 rounded-2xl border-[0.5px] border-border bg-card p-4 md:mb-16 md:p-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              'size-2.5 shrink-0 rounded-full',
              isOpenNow && freeNow > 0 ? 'bg-dot-win shadow-[0_0_12px] shadow-dot-win/60' : 'bg-dot-loss',
            )}
          />
          <div>
            <h2
              id="today-heading"
              className="text-[11px] font-semibold tracking-[1px] text-label uppercase md:text-xs"
            >
              {t('home.today.heading')}
            </h2>
            <p aria-live="polite" className="mt-0.5 text-[15px] text-muted-foreground md:text-base">
              {status}
            </p>
          </div>
        </div>

        <Button asChild className="h-11 rounded-xl bg-brand px-5 font-semibold text-white hover:bg-brand-accent">
          <Link to={isOpenNow || (hours && now < open) ? '/reserve' : `/reserve?date=${addDays(date, 1)}`}>
            {t('home.today.reserve')}
          </Link>
        </Button>
      </div>

      {slots.length > 0 ? (
        <div className="mt-5">
          <p className="mb-2 text-[11px] text-meta">{t('home.today.hourly')}</p>
          <ul className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {slots.map(({ minute, free }) => {
              const time = fromMinutes(minute)
              const ratio = free / TABLE_COUNT
              return (
                <li key={minute} className="shrink-0">
                  <Link
                    to={`/reserve?date=${date}&time=${fromMinutes(Math.max(minute, roundUpHalfHour(now)))}`}
                    aria-label={t('home.today.hourSlot', { time, free })}
                    className="flex w-[54px] flex-col items-center gap-1.5 rounded-lg bg-inset px-1 py-2 transition-colors hover:bg-row-active focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <span className="text-[11px] text-meta tabular-nums">{time}</span>
                    <span
                      aria-hidden="true"
                      className="relative h-8 w-2 overflow-hidden rounded-full bg-track"
                    >
                      <span
                        className={cn(
                          'absolute inset-x-0 bottom-0 rounded-full',
                          ratio > 0.4 ? 'bg-dot-win' : ratio > 0 ? 'bg-amber-500' : 'bg-dot-loss',
                        )}
                        style={{ height: `${Math.max(ratio, 0.06) * 100}%` }}
                      />
                    </span>
                    <span className="text-[13px] font-semibold text-foreground tabular-nums">{free}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}

      {isDemoBackend ? <DemoNotice kind="booking" className="mt-4" /> : null}
    </section>
  )
}

function roundUpHalfHour(minute: number) {
  return Math.ceil((minute + 1) / 30) * 30
}
