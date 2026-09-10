import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function PageHeader({ backTo = '/' }: { backTo?: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  // `default` means this was the first entry — there is no in-app history to
  // pop, so fall back to the given route instead of leaving the site.
  const canGoBack = location.key !== 'default'

  return (
    <header className="mb-6 flex items-center justify-between gap-3">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t('common.back')}
        onClick={() => (canGoBack ? navigate(-1) : navigate(backTo))}
        className="-ml-1.5 size-[30px] shrink-0 rounded-lg text-foreground hover:bg-secondary"
      >
        <ChevronLeft className="size-[18px]" strokeWidth={1.8} />
      </Button>

      <div className="flex items-center gap-1.5">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
