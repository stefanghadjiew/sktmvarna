import type { TranslationKey } from '@/i18n/types'

/**
 * Спортен комплекс „Варна“ — the hall itself. Everything the site says about
 * the building (table count, hours, facilities, prices) comes from here, so
 * the numbers can't drift apart between pages again.
 */

/** The one source for the table count. */
export const TABLE_COUNT = 14

export type HallTable = { id: number; row: 0 | 1 }

/** Two rows of seven, as drawn on the floor plan in the booking flow. */
export const hallTables: HallTable[] = Array.from(
  { length: TABLE_COUNT },
  (_, index) => ({ id: index + 1, row: index < TABLE_COUNT / 2 ? 0 : 1 }),
)

export type OpeningHours = { open: string; close: string } | null

/**
 * Indexed by `Date.getDay()` (0 = Sunday). `null` closes the hall that day.
 *
 * The booking flow builds its time slots from these, and the hall and home
 * pages list them.
 */
export const openingHours: OpeningHours[] = [
  { open: '10:00', close: '21:00' },
  { open: '10:00', close: '21:00' },
  { open: '10:00', close: '21:00' },
  { open: '10:00', close: '21:00' },
  { open: '10:00', close: '21:00' },
  { open: '10:00', close: '21:00' },
  { open: '10:00', close: '21:00' },
]

export function hoursOn(isoDate: string): OpeningHours {
  const [year, month, day] = isoDate.split('-').map(Number)
  return openingHours[new Date(year, month - 1, day).getDay()]
}

export const facilities: { id: string; labelKey: TranslationKey }[] = [
  { id: 'tables', labelKey: 'complex.facilities.tables' },
  { id: 'changing', labelKey: 'complex.facilities.changingRooms' },
  { id: 'bar', labelKey: 'complex.facilities.bar' },
  { id: 'shop', labelKey: 'complex.facilities.shop' },
]

export type PriceRow = {
  id: string
  labelKey: TranslationKey
  unitKey: TranslationKey
  /** In euro. `null` renders as "on request" until the hall publishes it. */
  amount: number | null
}

export type PriceGroup = {
  id: string
  titleKey: TranslationKey
  /** Who provides it — the complex rents tables, the club runs the coaching. */
  owner: 'complex' | 'club'
  rows: PriceRow[]
}

/**
 * PLACEHOLDER — no prices have been published yet, so every amount is `null`
 * and the page says "on request". Fill in the numbers here and they appear on
 * /prices and in the booking summary.
 */
export const priceGroups: PriceGroup[] = [
  {
    id: 'tables',
    titleKey: 'prices.groups.tables',
    owner: 'complex',
    rows: [
      { id: 'table-day', labelKey: 'prices.rows.tableDay', unitKey: 'prices.units.perHour', amount: null },
      { id: 'table-evening', labelKey: 'prices.rows.tableEvening', unitKey: 'prices.units.perHour', amount: null },
      { id: 'table-weekend', labelKey: 'prices.rows.tableWeekend', unitKey: 'prices.units.perHour', amount: null },
    ],
  },
  {
    id: 'coaching',
    titleKey: 'prices.groups.coaching',
    owner: 'club',
    rows: [
      { id: 'individual', labelKey: 'prices.rows.individual', unitKey: 'prices.units.perSession', amount: null },
      { id: 'group', labelKey: 'prices.rows.group', unitKey: 'prices.units.perMonth', amount: null },
      { id: 'kids', labelKey: 'prices.rows.kids', unitKey: 'prices.units.perMonth', amount: null },
    ],
  },
  {
    id: 'tournaments',
    titleKey: 'prices.groups.tournaments',
    owner: 'complex',
    rows: [
      { id: 'entry', labelKey: 'prices.rows.tournamentEntry', unitKey: 'prices.units.perTournament', amount: null },
    ],
  },
]

/** The hourly table rate, if published — used for the booking estimate. */
export function hourlyTableRate(): number | null {
  return priceGroups[0].rows[0].amount
}
