import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

export type StepId = 'when' | 'table' | 'details'

export function Steps({ steps, current }: { steps: StepId[]; current: StepId }) {
  const { t } = useTranslation()
  const currentIndex = steps.indexOf(current)

  return (
    <ol aria-label={t('reserve.steps.label')} className="mb-6 flex items-center gap-2 md:mb-8">
      {steps.map((step, index) => {
        const done = index < currentIndex
        const active = index === currentIndex
        return (
          <li key={step} className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
            <span
              className={cn(
                'flex size-6 items-center justify-center rounded-full text-[11px] font-bold',
                active && 'bg-brand text-white',
                done && 'bg-brand-tint text-brand-accent',
                !active && !done && 'bg-secondary text-label',
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={2.5} /> : index + 1}
            </span>
            <span className={cn('text-[13px] font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
              {t(`reserve.steps.${step}`)}
            </span>
            {index < steps.length - 1 ? <span aria-hidden="true" className="h-px w-5 bg-border md:w-10" /> : null}
          </li>
        )
      })}
    </ol>
  )
}
