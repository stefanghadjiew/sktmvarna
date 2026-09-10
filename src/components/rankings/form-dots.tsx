import { useTranslation } from 'react-i18next'

import type { FormResult } from '@/data/rankings'
import { cn } from '@/lib/utils'

const DOT_COLORS: Record<FormResult, string> = {
  win: 'bg-dot-win',
  loss: 'bg-dot-loss',
  none: 'bg-dot-none',
}

export function FormDots({ form }: { form: FormResult[] }) {
  const { t } = useTranslation()
  const summary = form.map((result) => t(`rankings.form.${result}`)).join(', ')

  return (
    <div
      className="mt-1 flex justify-end gap-[3px]"
      role="img"
      aria-label={`${t('rankings.form.label')}: ${summary}`}
    >
      {form.map((result, index) => (
        <span
          key={index}
          className={cn('size-[5px] rounded-full', DOT_COLORS[result])}
        />
      ))}
    </div>
  )
}
