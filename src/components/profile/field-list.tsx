import { useTranslation } from 'react-i18next'

import type { ProfileField } from '@/data/player-profile'
import { cn } from '@/lib/utils'

export function FieldList({ fields }: { fields: ProfileField[] }) {
  const { t } = useTranslation()

  return (
    <dl>
      {fields.map(({ labelKey, valueKey }, index) => (
        <div
          key={labelKey}
          className={cn(
            'flex justify-between gap-3 py-2 text-xs',
            index === 0 ? 'pt-0' : 'kv-line-t',
          )}
        >
          <dt className="text-meta">{t(labelKey)}</dt>
          <dd
            className={cn(
              'font-medium',
              valueKey ? 'text-kv-value' : 'text-kv-muted',
            )}
            // The em dash carries no meaning on its own for a screen reader.
            aria-label={valueKey ? undefined : t('profile.notSetLabel')}
          >
            {valueKey ? t(valueKey) : t('profile.notSet')}
          </dd>
        </div>
      ))}
    </dl>
  )
}
