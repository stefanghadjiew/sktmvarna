import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { contactPhone } from '@/data/contact'
import { cn } from '@/lib/utils'

/**
 * Shown wherever a form would otherwise look like it reaches the hall when it
 * doesn't yet — see `isDemoBackend` and `isDemoRegistration`.
 */
export function DemoNotice({
  kind,
  className,
}: {
  kind: 'booking' | 'tournament'
  className?: string
}) {
  const { t } = useTranslation()

  return (
    <div
      role="note"
      className={cn(
        'flex gap-3 rounded-xl border-[0.5px] border-amber-500/30 bg-amber-500/10 p-3.5 text-[13px] leading-[1.5] text-foreground',
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={1.8} />
      <p>
        <span className="font-semibold">{t('common.demo.title')}.</span>{' '}
        {t(`common.demo.${kind}`, { phone: contactPhone.display })}
      </p>
    </div>
  )
}
