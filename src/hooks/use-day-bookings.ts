import { useEffect, useState, useSyncExternalStore } from 'react'

import {
  bookingBackend,
  bookingsVersion,
  subscribeBookings,
  type Booking,
} from '@/lib/bookings'

type Loaded = { key: string; bookings: Booking[]; failed: boolean }

/**
 * The confirmed bookings on `date`, refetched whenever a booking is made,
 * moved or cancelled anywhere in the app. `bookings` is empty while loading.
 */
export function useDayBookings(date: string) {
  const version = useSyncExternalStore(subscribeBookings, bookingsVersion, bookingsVersion)
  const key = `${date}#${version}`
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  useEffect(() => {
    let cancelled = false
    bookingBackend.listDay(date).then(
      (bookings) => {
        if (!cancelled) setLoaded({ key, bookings, failed: false })
      },
      () => {
        if (!cancelled) setLoaded({ key, bookings: [], failed: true })
      },
    )
    return () => {
      cancelled = true
    }
  }, [date, key])

  // Until this day's answer lands, keep showing the last one rather than an
  // empty hall, unless it was for a different day.
  const current = loaded?.key === key
  const sameDay = loaded?.key.startsWith(`${date}#`)
  return {
    bookings: current || sameDay ? loaded!.bookings : [],
    loading: !current,
    failed: current ? loaded!.failed : false,
  }
}
