import { ArrowLeft, ArrowRight, CreditCard, Store } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'

import { DemoNotice } from '@/components/demo-notice'
import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'
import { BookingSummary } from '@/components/reserve/booking-summary'
import { BOOKING_HORIZON_DAYS, DatePicker, DurationPicker, FieldLabel, TimePicker } from '@/components/reserve/pickers'
import { Steps, type StepId } from '@/components/reserve/steps'
import { TablePicker, type TableView } from '@/components/reserve/table-picker'
import { TextField } from '@/components/text-field'
import { Button } from '@/components/ui/button'
import { useDayBookings } from '@/hooks/use-day-bookings'
import { usePageMeta } from '@/hooks/use-page-meta'
import {
  BookingError,
  bookingBackend,
  freeTablesFor,
  isDemoBackend,
  onlinePaymentAvailable,
  rememberedBookings,
  startTimesFor,
  type Booking,
  type Duration,
  type PaymentMethod,
} from '@/lib/bookings'
import { addDays, today } from '@/lib/dates'
import { cn } from '@/lib/utils'

const accent = { accent: <span className="text-brand" /> }

const isValidDate = (value: string | null): value is string =>
  !!value &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  value >= today() &&
  value < addDays(today(), BOOKING_HORIZON_DAYS)

/**
 * /reserve — book a table in three steps: when (day, length, start time),
 * which table (floor plan or list), and contact + payment.
 *
 * `?reschedule=<id>` reuses the same flow to move one of the visitor's own
 * bookings: it starts from that booking's slot and skips the details step.
 * `?date=` and `?time=` preselect a slot, for links from the home page.
 */
export function Reserve() {
  const { t } = useTranslation()
  usePageMeta('reserve')
  const [params] = useSearchParams()

  const [rescheduling] = useState<Booking | undefined>(() =>
    rememberedBookings().find(
      (booking) => booking.id === params.get('reschedule') && booking.status === 'confirmed',
    ),
  )
  const [step, setStep] = useState<StepId | 'done'>('when')
  const [date, setDate] = useState(() => {
    const fromUrl = params.get('date')
    return rescheduling && isValidDate(rescheduling.date)
      ? rescheduling.date
      : isValidDate(fromUrl)
        ? fromUrl
        : today()
  })
  const [duration, setDuration] = useState<Duration>(rescheduling?.duration ?? 60)
  const [start, setStart] = useState<string | null>(rescheduling?.start ?? params.get('time'))
  const [tableId, setTableId] = useState<number | null>(rescheduling?.tableId ?? null)
  const [view, setView] = useState<TableView>('plan')

  const last = rememberedBookings()[0]
  const [contact, setContact] = useState({
    name: last?.name ?? '',
    phone: last?.phone ?? '',
    email: last?.email ?? '',
  })
  const [payment, setPayment] = useState<PaymentMethod>('onsite')
  const [errors, setErrors] = useState<Partial<Record<'name' | 'phone' | 'email' | 'form', string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Booking | null>(null)

  const { bookings } = useDayBookings(date)
  const ignoreId = rescheduling?.id

  // A selection only counts while it is still possible — another booking or
  // a change of day or length can rule it out, and then it simply clears.
  const validStart =
    start &&
    startTimesFor(date, duration).includes(start) &&
    freeTablesFor(bookings, { date, start, duration }, ignoreId).length > 0
      ? start
      : null
  const free = validStart ? freeTablesFor(bookings, { date, start: validStart, duration }, ignoreId) : []
  const validTable = tableId !== null && free.includes(tableId) ? tableId : null

  const steps: StepId[] = rescheduling ? ['when', 'table'] : ['when', 'table', 'details']

  const validate = () => {
    const next: typeof errors = {}
    if (!contact.name.trim()) next.name = t('reserve.errors.name')
    if (contact.phone.replace(/\D/g, '').length < 6) next.phone = t('reserve.errors.phone')
    if (contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      next.email = t('reserve.errors.email')
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (event?: FormEvent) => {
    event?.preventDefault()
    if (!validStart || validTable === null) return
    if (!rescheduling && !validate()) return

    const slot = { date, start: validStart, duration, tableId: validTable }
    setSubmitting(true)
    setErrors({})
    try {
      const booking = rescheduling
        ? await bookingBackend.reschedule(rescheduling, slot)
        : await bookingBackend.create({
            ...slot,
            name: contact.name.trim(),
            phone: contact.phone.trim(),
            email: contact.email.trim(),
            payment,
          })
      setResult(booking)
      setStep('done')
    } catch (error) {
      const conflict = error instanceof BookingError && error.reason === 'conflict'
      setErrors({ form: t(conflict ? 'reserve.errors.conflict' : 'reserve.errors.network') })
      if (conflict) setStep('table')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'done' && result) {
    return (
      <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
        <BookingDone booking={result} moved={!!rescheduling} />
      </AppShell>
    )
  }

  return (
    <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
      <PageIntro
        eyebrow={t('reserve.eyebrow')}
        title={<Trans i18nKey={rescheduling ? 'reserve.rescheduleTitle' : 'reserve.title'} components={accent} />}
        subtitle={
          rescheduling
            ? t('reserve.rescheduleSubtitle', { code: rescheduling.code })
            : t('reserve.subtitle')
        }
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10">
        <div>
          <Steps steps={steps} current={step === 'done' ? steps.at(-1)! : step} />

          {isDemoBackend ? <DemoNotice kind="booking" className="mb-6" /> : null}

          {step === 'when' ? (
            <div className="flex flex-col gap-6">
              <DatePicker value={date} onChange={setDate} />
              <DurationPicker value={duration} onChange={setDuration} />
              <TimePicker
                date={date}
                duration={duration}
                bookings={bookings}
                value={validStart}
                onChange={setStart}
                ignoreId={ignoreId}
              />
              <StepActions>
                <Button
                  type="button"
                  disabled={!validStart}
                  onClick={() => setStep('table')}
                  className={primaryButton}
                >
                  {t('reserve.actions.next')}
                  <ArrowRight className="size-4" strokeWidth={1.8} />
                </Button>
              </StepActions>
            </div>
          ) : null}

          {step === 'table' && validStart ? (
            <div className="flex flex-col gap-6">
              {free.length === 0 ? (
                <p className="text-[14px] text-muted-foreground">{t('reserve.noTables')}</p>
              ) : (
                <TablePicker free={free} value={validTable} onChange={setTableId} view={view} onViewChange={setView} />
              )}
              {errors.form ? <FormError message={errors.form} /> : null}
              <StepActions onBack={() => setStep('when')}>
                {rescheduling ? (
                  <Button
                    type="button"
                    disabled={validTable === null || submitting}
                    onClick={() => void submit()}
                    className={primaryButton}
                  >
                    {submitting ? t('reserve.actions.confirming') : t('reserve.actions.reschedule')}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={validTable === null}
                    onClick={() => setStep('details')}
                    className={primaryButton}
                  >
                    {t('reserve.actions.next')}
                    <ArrowRight className="size-4" strokeWidth={1.8} />
                  </Button>
                )}
              </StepActions>
            </div>
          ) : null}

          {/* Lost the slot (another booking, or the clock moved past it) —
              send them back to pick a time rather than show an empty step. */}
          {step !== 'when' && (!validStart || (step === 'details' && validTable === null)) ? (
            <div className="flex flex-col gap-4">
              <FormError message={t('reserve.errors.conflict')} />
              <StepActions onBack={() => setStep(validStart ? 'table' : 'when')} />
            </div>
          ) : null}

          {step === 'details' && validStart && validTable !== null ? (
            <form noValidate onSubmit={submit} className="flex flex-col gap-6">
              <fieldset className="grid gap-4 sm:grid-cols-2">
                <legend className="mb-3 text-[11px] font-semibold tracking-[1px] text-label uppercase md:text-xs">
                  {t('reserve.contact.heading')}
                </legend>
                <TextField
                  label={t('reserve.contact.name')}
                  autoComplete="name"
                  value={contact.name}
                  onChange={(event) => setContact({ ...contact, name: event.target.value })}
                  error={errors.name}
                  required
                  className="sm:col-span-2"
                />
                <TextField
                  label={t('reserve.contact.phone')}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={contact.phone}
                  onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                  error={errors.phone}
                  required
                />
                <TextField
                  label={t('reserve.contact.email')}
                  type="email"
                  autoComplete="email"
                  value={contact.email}
                  onChange={(event) => setContact({ ...contact, email: event.target.value })}
                  hint={t('reserve.contact.emailHint')}
                  error={errors.email}
                />
              </fieldset>

              <fieldset>
                <legend>
                  <FieldLabel>{t('reserve.payment.heading')}</FieldLabel>
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  <PaymentOption
                    checked={payment === 'onsite'}
                    onSelect={() => setPayment('onsite')}
                    icon={<Store className="size-5" strokeWidth={1.8} />}
                    title={t('reserve.payment.onsite')}
                    hint={t('reserve.payment.onsiteHint')}
                  />
                  <PaymentOption
                    checked={payment === 'online'}
                    onSelect={() => setPayment('online')}
                    disabled={!onlinePaymentAvailable}
                    icon={<CreditCard className="size-5" strokeWidth={1.8} />}
                    title={t('reserve.payment.online')}
                    hint={onlinePaymentAvailable ? t('reserve.payment.onlineHint') : t('reserve.payment.onlineUnavailable')}
                  />
                </div>
              </fieldset>

              {errors.form ? <FormError message={errors.form} /> : null}

              <StepActions onBack={() => setStep('table')}>
                <Button type="submit" disabled={submitting} className={primaryButton}>
                  {submitting ? t('reserve.actions.confirming') : t('reserve.actions.confirm')}
                </Button>
              </StepActions>
            </form>
          ) : null}
        </div>

        <aside className="mt-8 lg:sticky lg:top-24 lg:mt-0">
          <BookingSummary date={date} start={validStart} duration={duration} tableId={validTable} />
          <Link
            to="/reserve/my"
            className="mt-3 inline-block rounded-sm text-[13px] font-semibold text-brand-accent hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {t('reserve.myLink')} →
          </Link>
        </aside>
      </div>
    </AppShell>
  )
}

const primaryButton =
  'h-11 rounded-xl bg-brand px-6 font-semibold text-white hover:bg-brand-accent'

function StepActions({ onBack, children }: { onBack?: () => void; children?: ReactNode }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      {onBack ? (
        <Button type="button" variant="ghost" onClick={onBack} className="h-11 rounded-xl">
          <ArrowLeft className="size-4" strokeWidth={1.8} />
          {t('reserve.actions.back')}
        </Button>
      ) : (
        <span />
      )}
      {children}
    </div>
  )
}

function FormError({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-[13px] font-medium text-destructive">
      {message}
    </p>
  )
}

function PaymentOption({
  checked,
  onSelect,
  disabled,
  icon,
  title,
  hint,
}: {
  checked: boolean
  onSelect: () => void
  disabled?: boolean
  icon: ReactNode
  title: string
  hint: string
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border-[0.5px] p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
        checked ? 'border-brand bg-brand-tint' : 'border-border bg-card hover:border-brand/40',
        disabled && 'cursor-not-allowed opacity-50 hover:border-border',
      )}
    >
      <input
        type="radio"
        name="payment"
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
        className="sr-only"
      />
      <span className={cn('mt-0.5', checked ? 'text-brand-icon' : 'text-muted-foreground')}>{icon}</span>
      <span>
        <span className="block text-[14px] font-semibold text-foreground">{title}</span>
        <span className="mt-0.5 block text-[12px] text-muted-foreground">{hint}</span>
      </span>
    </label>
  )
}

function BookingDone({ booking, moved }: { booking: Booking; moved: boolean }) {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-[560px] py-4 md:py-10">
      <PageIntro
        eyebrow={t('reserve.eyebrow')}
        title={<Trans i18nKey={moved ? 'reserve.success.rescheduled' : 'reserve.success.title'} components={accent} />}
        subtitle={isDemoBackend ? t('reserve.success.notifiedDemo') : t('reserve.success.notified')}
      />

      <div className="mb-4 rounded-2xl border-[0.5px] border-brand/40 bg-brand-tint p-5 text-center">
        <p className="text-[11px] font-semibold tracking-[1px] text-label uppercase">{t('reserve.success.code')}</p>
        <p className="mt-1 font-mono text-[32px] font-bold tracking-[4px] text-foreground">{booking.code}</p>
      </div>

      <BookingSummary
        date={booking.date}
        start={booking.start}
        duration={booking.duration}
        tableId={booking.tableId}
        className="mb-6"
      />

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Button asChild className={primaryButton}>
          <Link to="/reserve/my">{t('reserve.success.myBookings')}</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-xl">
          {/* A full navigation resets the flow's state for a fresh booking. */}
          <a href="/reserve">{t('reserve.success.another')}</a>
        </Button>
      </div>
    </div>
  )
}
