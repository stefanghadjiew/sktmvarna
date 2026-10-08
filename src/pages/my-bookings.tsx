import { CalendarClock, X } from 'lucide-react'
import { useState, useSyncExternalStore, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { DemoNotice } from '@/components/demo-notice'
import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'
import { SectionHeading } from '@/components/section-heading'
import { TextField } from '@/components/text-field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useFormatters } from '@/hooks/use-formatters'
import { usePageMeta } from '@/hooks/use-page-meta'
import {
  bookingBackend,
  bookingsVersion,
  forgetBooking,
  isDemoBackend,
  rememberBooking,
  rememberedBookings,
  subscribeBookings,
  type Booking,
} from '@/lib/bookings'
import { fromISODate, fromMinutes, toMinutes } from '@/lib/dates'

function isPast(booking: Booking) {
  return new Date(`${booking.date}T${fromMinutes(toMinutes(booking.start) + booking.duration)}`) < new Date()
}

/**
 * /reserve/my — the customer's side of a booking. Without accounts, "my"
 * bookings are the ones made or looked up on this device; any other one can
 * be pulled in with its code and phone number.
 */
export function MyBookings() {
  const { t } = useTranslation()
  usePageMeta('myBookings')

  // Re-read on every booking change so a cancel or move shows at once.
  useSyncExternalStore(subscribeBookings, bookingsVersion, bookingsVersion)
  const bookings = rememberedBookings().sort((a, b) =>
    `${b.date}${b.start}`.localeCompare(`${a.date}${a.start}`),
  )
  const upcoming = bookings.filter((booking) => booking.status === 'confirmed' && !isPast(booking))
  const earlier = bookings.filter((booking) => !upcoming.includes(booking))

  return (
    <AppShell header={<PageHeader backTo="/reserve" />} nav={<BottomNav />}>
      <PageIntro
        eyebrow={t('myBookings.eyebrow')}
        title={<Trans i18nKey="myBookings.title" components={{ accent: <span className="text-brand" /> }} />}
        subtitle={t('myBookings.subtitle')}
      />

      {isDemoBackend ? <DemoNotice kind="booking" className="mb-6 max-w-[720px]" /> : null}

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10">
        <div>
          {bookings.length === 0 ? (
            <div className="rounded-2xl border-[0.5px] border-border bg-card p-6 text-center">
              <p className="text-[14px] text-muted-foreground">{t('myBookings.empty')}</p>
              <Button asChild className="mt-4 rounded-xl bg-brand text-white hover:bg-brand-accent">
                <Link to="/reserve">{t('myBookings.newBooking')}</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {[...upcoming, ...earlier].map((booking) => (
                <li key={booking.id}>
                  <BookingRow booking={booking} upcoming={upcoming.includes(booking)} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <Lookup />
      </div>
    </AppShell>
  )
}

function BookingRow({ booking, upcoming }: { booking: Booking; upcoming: boolean }) {
  const { t } = useTranslation()
  const { longDate } = useFormatters()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  const end = fromMinutes(toMinutes(booking.start) + booking.duration)
  const status = booking.status === 'cancelled' ? 'cancelled' : upcoming ? 'confirmed' : 'past'

  const cancel = async () => {
    setBusy(true)
    try {
      await bookingBackend.cancel(booking)
    } finally {
      setBusy(false)
      setConfirming(false)
    }
  }

  return (
    <article className="rounded-2xl border-[0.5px] border-border bg-card p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-card-foreground first-letter:uppercase">
            {longDate.format(fromISODate(booking.date))}
          </p>
          <p className="mt-0.5 text-[13px] text-card-meta tabular-nums">
            {booking.start}–{end} · {t('reserve.table', { id: booking.tableId })} · {booking.code}
          </p>
        </div>
        <Badge
          variant={status === 'confirmed' ? 'success' : 'secondary'}
          className="shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold"
        >
          {t(`myBookings.status.${status}`)}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {upcoming && !confirming ? (
          <>
            <Button asChild variant="outline" size="sm" className="rounded-lg">
              <Link to={`/reserve?reschedule=${booking.id}`}>
                <CalendarClock className="size-4" strokeWidth={1.8} />
                {t('myBookings.actions.move')}
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(true)}
              className="rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="size-4" strokeWidth={1.8} />
              {t('myBookings.actions.cancel')}
            </Button>
          </>
        ) : null}

        {confirming ? (
          <div role="alertdialog" aria-label={t('myBookings.actions.cancelQuestion')} className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-medium text-foreground">{t('myBookings.actions.cancelQuestion')}</span>
            <Button type="button" size="sm" variant="destructive" disabled={busy} onClick={() => void cancel()} className="rounded-lg">
              {t('myBookings.actions.confirmCancel')}
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setConfirming(false)} className="rounded-lg">
              {t('myBookings.actions.keep')}
            </Button>
          </div>
        ) : null}

        {!upcoming ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => forgetBooking(booking.id)}
            className="rounded-lg text-muted-foreground"
          >
            {t('myBookings.actions.forget')}
          </Button>
        ) : null}
      </div>
    </article>
  )
}

function Lookup() {
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!code.trim() || !phone.trim()) return
    setBusy(true)
    setNotFound(false)
    try {
      const booking = await bookingBackend.find(code, phone)
      if (booking) {
        rememberBooking(booking)
        setCode('')
      } else {
        setNotFound(true)
      }
    } catch {
      setNotFound(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <aside className="mt-8 rounded-2xl bg-inset p-5 lg:sticky lg:top-24 lg:mt-0">
      <SectionHeading className="md:mb-3">{t('myBookings.lookup.heading')}</SectionHeading>
      <p className="mb-4 text-[13px] leading-[1.5] text-muted-foreground">{t('myBookings.lookup.body')}</p>
      <form noValidate onSubmit={submit} className="flex flex-col gap-3">
        <TextField
          label={t('myBookings.lookup.code')}
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          autoComplete="off"
          className="[&_input]:font-mono [&_input]:tracking-[2px]"
        />
        <TextField
          label={t('myBookings.lookup.phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={notFound ? t('myBookings.lookup.notFound') : null}
        />
        <Button type="submit" disabled={busy} className="mt-1 h-11 rounded-xl">
          {t('myBookings.lookup.submit')}
        </Button>
      </form>
    </aside>
  )
}
