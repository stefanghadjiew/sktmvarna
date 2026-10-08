import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { TABLE_COUNT, facilities } from '@/data/complex'

export function FacilitiesList() {
  const { t } = useTranslation()

  return (
    <ul className="flex flex-col gap-2.5">
      {facilities.map(({ id, labelKey }) => (
        <li key={id} className="flex items-center gap-3 text-[14px] text-foreground md:text-[15px]">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint">
            <Check className="size-3.5 text-brand-icon" strokeWidth={2.2} />
          </span>
          {t(labelKey, { count: TABLE_COUNT })}
        </li>
      ))}
    </ul>
  )
}
