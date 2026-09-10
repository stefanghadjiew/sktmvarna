import { Trans, useTranslation } from 'react-i18next'

import { PageIntro } from '@/components/page-intro'

export function Hero() {
  const { t } = useTranslation()

  return (
    <PageIntro
      eyebrow={t('home.eyebrow')}
      title={
        <Trans
          i18nKey="home.title"
          components={{ accent: <span className="text-brand" /> }}
        />
      }
      subtitle={t('home.subtitle')}
      className="mb-[26px]"
    />
  )
}
