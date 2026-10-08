import { useTranslation } from 'react-i18next'

import { hallTables } from '@/data/complex'
import { cn } from '@/lib/utils'

export type TableView = 'plan' | 'list'

type Props = {
  free: number[]
  value: number | null
  onChange: (tableId: number) => void
  view: TableView
  onViewChange: (view: TableView) => void
}

/**
 * Pick a table from a drawing of the hall — two rows of seven, each table
 * with its net — or from a plain list, which is also what screen readers get
 * the most out of. Both are radio groups over the same state.
 */
export function TablePicker({ free, value, onChange, view, onViewChange }: Props) {
  const { t } = useTranslation()

  const state = (id: number) =>
    id === value ? 'selected' : free.includes(id) ? 'free' : 'busy'

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Legend />
        <div
          role="group"
          aria-label={t('reserve.view.label')}
          className="flex shrink-0 rounded-lg bg-secondary p-0.5"
        >
          {(['plan', 'list'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => onViewChange(option)}
              className={cn(
                'rounded-md px-2.5 py-1 text-[12px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                view === option ? 'bg-card text-foreground shadow-sm' : 'text-label hover:text-foreground',
              )}
            >
              {t(`reserve.view.${option}`)}
            </button>
          ))}
        </div>
      </div>

      {view === 'plan' ? (
        <div
          role="radiogroup"
          aria-label={t('reserve.plan')}
          className="rounded-2xl border-[0.5px] border-border bg-[#c8352f]/[0.08] p-3 md:p-5 dark:bg-[#c8352f]/[0.12]"
        >
          {[0, 1].map((row) => (
            <div
              key={row}
              className={cn('grid grid-cols-4 gap-2 sm:grid-cols-7 md:gap-3', row === 1 && 'mt-4 border-t border-dashed border-border pt-4 md:mt-6 md:pt-6')}
            >
              {hallTables
                .filter((table) => table.row === row)
                .map(({ id }) => {
                  const current = state(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={current === 'selected'}
                      aria-label={`${t('reserve.table', { id })} — ${t(`reserve.tableState.${current}`)}`}
                      disabled={current === 'busy'}
                      onClick={() => onChange(id)}
                      className={cn(
                        'group relative flex aspect-[5/3] items-center justify-center rounded-md border-2 transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                        current === 'selected' && 'border-brand bg-brand text-white shadow-lg shadow-brand/30',
                        current === 'free' && 'border-[#1d3557]/70 bg-[#1d3557] text-white hover:-translate-y-0.5 hover:border-brand',
                        current === 'busy' && 'cursor-not-allowed border-transparent bg-foreground/15 text-foreground/40',
                      )}
                    >
                      {/* The net across the middle of the table. */}
                      <span aria-hidden="true" className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-white/60" />
                      <span className="relative rounded bg-black/25 px-1.5 text-[13px] font-bold tabular-nums">
                        {t('reserve.tableShort', { id })}
                      </span>
                    </button>
                  )
                })}
            </div>
          ))}
        </div>
      ) : (
        <ul role="radiogroup" aria-label={t('reserve.view.list')} className="grid gap-1.5 sm:grid-cols-2">
          {hallTables.map(({ id }) => {
            const current = state(id)
            return (
              <li key={id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={current === 'selected'}
                  disabled={current === 'busy'}
                  onClick={() => onChange(id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border-[0.5px] px-4 py-3 text-left text-[14px] transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                    current === 'selected' ? 'border-brand bg-brand-tint' : 'border-border bg-card hover:border-brand/40',
                  )}
                >
                  <span className="font-semibold text-foreground">{t('reserve.table', { id })}</span>
                  <span
                    className={cn(
                      'text-[12px]',
                      current === 'free' ? 'text-success' : current === 'selected' ? 'font-semibold text-brand-accent' : 'text-meta',
                    )}
                  >
                    {t(`reserve.tableState.${current}`)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function Legend() {
  const { t } = useTranslation()
  const items = [
    { key: 'free', swatch: 'bg-[#1d3557]' },
    { key: 'busy', swatch: 'bg-foreground/15' },
    { key: 'selected', swatch: 'bg-brand' },
  ] as const

  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
      {items.map(({ key, swatch }) => (
        <li key={key} className="flex items-center gap-1.5">
          <span aria-hidden="true" className={cn('size-2.5 rounded-sm', swatch)} />
          {t(`reserve.tableState.${key}`)}
        </li>
      ))}
    </ul>
  )
}
