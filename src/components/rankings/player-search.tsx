import { useTranslation } from 'react-i18next'

import { Input } from '@/components/ui/input'

export function PlayerSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const { t } = useTranslation()

  return (
    <Input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={t('rankings.searchPlaceholder')}
      aria-label={t('rankings.searchLabel')}
      className="mb-[18px] h-auto rounded-xl border-[0.5px] border-field-border bg-card px-3 py-2.5 text-xs text-foreground shadow-none placeholder:text-label md:mb-6 md:py-3 md:text-sm"
    />
  )
}
