import { TABLE_COUNT, hallTables, hoursOn } from '@/data/complex'
import { fromMinutes, nowMinutes, today, toMinutes } from '@/lib/dates'

/**
 * Table reservations for Спортен комплекс „Варна“.
 *
 * The UI only talks to `bookingBackend`. Two implementations sit behind it:
 *
 * - **HTTP** — used when `VITE_BOOKING_API_URL` is set at build time. The
 *   server owns the bookings, takes card payments, and sends the e-mail/SMS
 *   confirmations. The contract it has to implement is documented on
 *   `httpBackend` below.
 * - **Demo** — the default while there is no server. Bookings live in this
 *   browser's storage, so the whole flow can be tried end to end, but the hall
 *   never sees them. The UI says so wherever it matters (`isDemoBackend`).
 */

export const DURATIONS = [60, 90, 120] as const
export type Duration = (typeof DURATIONS)[number]

/** Start times are offered on the half hour. */
export const SLOT_STEP_MINUTES = 30

export type PaymentMethod = 'onsite' | 'online'

export type Slot = {
  date: string
  start: string
  duration: Duration
  tableId: number
}

export type Contact = {
  name: string
  phone: string
  email: string
}

export type Booking = Slot &
  Contact & {
    id: string
    /** Short code the customer quotes at the desk or uses to look it up. */
    code: string
    payment: PaymentMethod
    status: 'confirmed' | 'cancelled'
    createdAt: string
  }

export type BookingDraft = Slot & Contact & { payment: PaymentMethod }

export class BookingError extends Error {
  readonly reason: 'conflict' | 'notFound' | 'network'

  constructor(reason: BookingError['reason'], message: string = reason) {
    super(message)
    this.reason = reason
  }
}

type BookingBackend = {
  /** Confirmed bookings on a day — enough to work out what is free. */
  listDay(date: string): Promise<Booking[]>
  create(draft: BookingDraft): Promise<Booking>
  find(code: string, phone: string): Promise<Booking | null>
  reschedule(booking: Booking, slot: Slot): Promise<Booking>
  cancel(booking: Booking): Promise<Booking>
}

/* ------------------------------------------------------------------ */
/* Availability                                                        */
/* ------------------------------------------------------------------ */

type Span = { date: string; start: string; duration: number }

function overlaps(a: Span, b: Span) {
  if (a.date !== b.date) return false
  const aStart = toMinutes(a.start)
  const bStart = toMinutes(b.start)
  return aStart < bStart + b.duration && bStart < aStart + a.duration
}

/**
 * Tables free for the whole of `slot`. `ignoreId` leaves a booking out of the
 * count, so rescheduling can keep its own table.
 */
export function freeTablesFor(
  bookings: Booking[],
  slot: Span,
  ignoreId?: string,
): number[] {
  const busy = new Set(
    bookings
      .filter(
        (booking) =>
          booking.status === 'confirmed' &&
          booking.id !== ignoreId &&
          overlaps(booking, slot),
      )
      .map((booking) => booking.tableId),
  )
  return hallTables.map((table) => table.id).filter((id) => !busy.has(id))
}

/** Start times on `date` that fit `duration` before closing and aren't past. */
export function startTimesFor(date: string, duration: Duration): string[] {
  const hours = hoursOn(date)
  if (!hours) return []
  const open = toMinutes(hours.open)
  const close = toMinutes(hours.close)
  const earliest = date === today() ? nowMinutes() : -1
  const times: string[] = []
  for (let start = open; start + duration <= close; start += SLOT_STEP_MINUTES) {
    if (start > earliest) times.push(fromMinutes(start))
  }
  return times
}

/** Free tables at one moment, for the "free right now" indicator. */
export function freeCountAt(bookings: Booking[], date: string, minute: number) {
  return freeTablesFor(bookings, {
    date,
    start: fromMinutes(minute),
    duration: 1,
  }).length
}

/* ------------------------------------------------------------------ */
/* Change notifications                                                */
/* ------------------------------------------------------------------ */

const listeners = new Set<() => void>()
let version = 0

function notify() {
  version += 1
  listeners.forEach((listener) => listener())
}

export function subscribeBookings(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function bookingsVersion() {
  return version
}

/* ------------------------------------------------------------------ */
/* Demo backend (this browser only)                                    */
/* ------------------------------------------------------------------ */

const DEMO_STORAGE_KEY = 'sktm-demo-bookings'

function readDemo(): Booking[] {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Booking[]) : []
  } catch {
    return []
  }
}

function writeDemo(bookings: Booking[]) {
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(bookings))
  } catch {
    // Storage blocked — the booking lasts until the tab closes.
  }
}

function randomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from(
    crypto.getRandomValues(new Uint8Array(6)),
    (n) => alphabet[n % alphabet.length],
  ).join('')
}

const normalisePhone = (phone: string) => phone.replace(/[^\d+]/g, '')

const demoBackend: BookingBackend = {
  async listDay(date) {
    return readDemo().filter(
      (booking) => booking.date === date && booking.status === 'confirmed',
    )
  },

  async create(draft) {
    const all = readDemo()
    if (!freeTablesFor(all, draft).includes(draft.tableId)) {
      throw new BookingError('conflict')
    }
    const booking: Booking = {
      ...draft,
      id: crypto.randomUUID(),
      code: randomCode(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    writeDemo([...all, booking])
    return booking
  },

  async find(code, phone) {
    return (
      readDemo().find(
        (booking) =>
          booking.code === code.trim().toUpperCase() &&
          normalisePhone(booking.phone) === normalisePhone(phone),
      ) ?? null
    )
  },

  async reschedule(booking, slot) {
    const all = readDemo()
    if (!freeTablesFor(all, slot, booking.id).includes(slot.tableId)) {
      throw new BookingError('conflict')
    }
    const updated = { ...booking, ...slot }
    writeDemo(all.map((item) => (item.id === booking.id ? updated : item)))
    return updated
  },

  async cancel(booking) {
    const updated = { ...booking, status: 'cancelled' as const }
    writeDemo(readDemo().map((item) => (item.id === booking.id ? updated : item)))
    return updated
  },
}

/* ------------------------------------------------------------------ */
/* HTTP backend                                                        */
/* ------------------------------------------------------------------ */

/**
 * The contract a booking server has to meet. All bodies are JSON and every
 * booking is the `Booking` shape above.
 *
 *   GET    /bookings?date=YYYY-MM-DD   → Booking[]  (confirmed only; contact
 *                                        fields may be blanked for privacy)
 *   POST   /bookings                   BookingDraft → Booking
 *                                        409 if the table was taken meanwhile.
 *                                        Sends the e-mail/SMS confirmation; for
 *                                        `payment: 'online'` it may instead
 *                                        return { checkoutUrl } to redirect to.
 *   GET    /bookings/:code?phone=…     → Booking, 404 if code+phone don't match
 *   PATCH  /bookings/:id               { phone, ...Slot } → Booking (409 on clash)
 *   POST   /bookings/:id/cancel        { phone } → Booking
 */
function httpBackend(baseUrl: string): BookingBackend {
  async function call<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response
    try {
      response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: { 'content-type': 'application/json', ...init?.headers },
      })
    } catch {
      throw new BookingError('network')
    }
    if (response.status === 409) throw new BookingError('conflict')
    if (response.status === 404) throw new BookingError('notFound')
    if (!response.ok) throw new BookingError('network', `HTTP ${response.status}`)
    return (await response.json()) as T
  }

  return {
    listDay: (date) => call(`/bookings?date=${encodeURIComponent(date)}`),
    create: async (draft) => {
      const result = await call<Booking | { checkoutUrl: string }>('/bookings', {
        method: 'POST',
        body: JSON.stringify(draft),
      })
      if ('checkoutUrl' in result) {
        window.location.assign(result.checkoutUrl)
        // The page is navigating away; nothing after this renders.
        return new Promise<Booking>(() => {})
      }
      return result
    },
    find: (code, phone) =>
      call<Booking>(
        `/bookings/${encodeURIComponent(code.trim().toUpperCase())}?phone=${encodeURIComponent(phone)}`,
      ).catch((error: unknown) => {
        if (error instanceof BookingError && error.reason === 'notFound') return null
        throw error
      }),
    reschedule: (booking, slot) =>
      call(`/bookings/${booking.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ phone: booking.phone, ...slot }),
      }),
    cancel: (booking) =>
      call(`/bookings/${booking.id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ phone: booking.phone }),
      }),
  }
}

const apiUrl = import.meta.env.VITE_BOOKING_API_URL as string | undefined

/** True while bookings only live in this browser. */
export const isDemoBackend = !apiUrl

/** Card payment needs a server to create the checkout session. */
export const onlinePaymentAvailable = !isDemoBackend

const backend = apiUrl ? httpBackend(apiUrl.replace(/\/$/, '')) : demoBackend

/**
 * Every write is remembered on this device, which also notifies subscribers,
 * so availability and "my bookings" on screen stay current.
 */
export const bookingBackend: BookingBackend = {
  listDay: (date) => backend.listDay(date),
  create: (draft) => backend.create(draft).then(remembered),
  find: (code, phone) => backend.find(code, phone),
  reschedule: (booking, slot) =>
    backend.reschedule(booking, slot).then(remembered),
  cancel: (booking) => backend.cancel(booking).then(remembered),
}

function remembered(booking: Booking) {
  rememberBooking(booking)
  return booking
}

/* ------------------------------------------------------------------ */
/* "My bookings" — remembered on this device                           */
/* ------------------------------------------------------------------ */

const MINE_STORAGE_KEY = 'sktm-my-bookings'

/**
 * There are no accounts, so the customer profile is the code + phone pair of
 * each booking made here, plus any looked up by code. That is all the server
 * needs to show, move or cancel one.
 */
export function rememberedBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(MINE_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Booking[]) : []
  } catch {
    return []
  }
}

export function rememberBooking(booking: Booking) {
  const others = rememberedBookings().filter((item) => item.id !== booking.id)
  try {
    localStorage.setItem(MINE_STORAGE_KEY, JSON.stringify([booking, ...others]))
  } catch {
    // Not remembered — it can still be found again by code.
  }
  notify()
}

export function forgetBooking(id: string) {
  try {
    localStorage.setItem(
      MINE_STORAGE_KEY,
      JSON.stringify(rememberedBookings().filter((item) => item.id !== id)),
    )
  } catch {
    // Nothing to forget.
  }
  notify()
}

export { TABLE_COUNT }
