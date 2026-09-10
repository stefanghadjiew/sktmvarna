import { useTranslation } from 'react-i18next'

import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { FieldList } from '@/components/profile/field-list'
import { ProfileHeaderCard } from '@/components/profile/profile-header-card'
import { ProfileSection } from '@/components/profile/profile-section'
import { RatingChangeGrid } from '@/components/profile/rating-change-grid'
import { playerProfile } from '@/data/player-profile'

export function PlayerProfilePage() {
  const { t } = useTranslation()
  const profile = playerProfile

  return (
    <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
      <div className="mx-auto max-w-[1120px]">
        <ProfileHeaderCard profile={profile} />

        {/* Four short panels stack on a phone and pair up once there is room
            for two readable columns. */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-6">
          <ProfileSection title={t('profile.sections.basicInfo')}>
            <FieldList fields={profile.basicInfo} />
          </ProfileSection>

          <ProfileSection title={t('profile.sections.playingStyle')}>
            <FieldList fields={profile.playingStyle} />
          </ProfileSection>

          <ProfileSection title={t('profile.sections.recentMatches')}>
            {profile.recentMatches.length === 0 ? (
              <p className="text-xs text-empty italic">
                {t('profile.noMatches')}
              </p>
            ) : null}
          </ProfileSection>

          <ProfileSection
            title={t('profile.sections.ratingChange')}
            className="mb-1"
          >
            <RatingChangeGrid entries={profile.ratingChange} />
          </ProfileSection>
        </div>
      </div>
    </AppShell>
  )
}
