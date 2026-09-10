import { Trans, useTranslation } from 'react-i18next'

import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'
import { FeaturedTrainerCard } from '@/components/trainers/featured-trainer-card'
import { TrainerList } from '@/components/trainers/trainer-list'
import { featuredTrainer, otherTrainers } from '@/data/trainers'

export function Trainers() {
  const { t } = useTranslation()

  return (
    <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
      <div className="mx-auto max-w-[1180px]">
        <PageIntro
          eyebrow={t('trainers.eyebrow')}
          title={
            <Trans
              i18nKey="trainers.title"
              components={{ accent: <span className="text-brand" /> }}
            />
          }
          subtitle={t('trainers.subtitle')}
        />

        {/* The head coach's bio is long-form, so it takes the wide column and
            the roster sits alongside it rather than below the fold. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-12">
          <FeaturedTrainerCard trainer={featuredTrainer} />
          <TrainerList
            trainers={otherTrainers}
            className="pb-1 lg:sticky lg:top-28"
          />
        </div>
      </div>
    </AppShell>
  )
}
