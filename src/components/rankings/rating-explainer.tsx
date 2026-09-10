import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

/** The "+" in the design implies expand-in-place, so this is a disclosure. */
export function RatingExplainer() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="pt-1 pb-3.5 md:pb-5">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 rounded-md text-xs font-medium text-info focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:text-[13px]"
      >
        {t('rankings.howCalculated')}
        <Plus
          className={cn(
            'size-3.5 shrink-0 text-label transition-transform duration-200',
            isOpen && 'rotate-45',
          )}
          strokeWidth={2}
        />
      </button>

      {isOpen ? (
        <p
          id={panelId}
          className="mt-2 text-[11.5px] leading-[1.6] text-muted-foreground md:text-xs"
        >
          {t('rankings.howCalculatedBody')}
        </p>
      ) : null}
    </div>
  )
}
