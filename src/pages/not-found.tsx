import { Trans, useTranslation } from 'react-i18next'

import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'

/**
 * Placeholder for destinations the designs reference but that aren't built
 * yet, so navigation never lands on a blank screen.
 */
export function NotFound() {
  const { t } = useTranslation()

  return (
    <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
      <PageIntro
        eyebrow={t('home.eyebrow')}
        title={
          <Trans
            i18nKey="notFound.title"
            components={{ accent: <span className="text-brand" /> }}
          />
        }
        subtitle={t('notFound.subtitle')}
        className="mb-0 md:mb-0"
      />
    </AppShell>
  )
}
