import { ArrowRight } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { BottomNav } from '@/components/home/bottom-nav'
import { TopBar } from '@/components/home/top-bar'
import { SocialLinks } from '@/components/landing/social-links'
import { VenueMap } from '@/components/landing/venue-map'
import { AppShell } from '@/components/layout/app-shell'
import { PageIntro } from '@/components/page-intro'
import { Button } from '@/components/ui/button'

/**
 * The site's front door: who the club is, where the hall is, where to follow
 * it, and the two screens worth sending a first-time visitor to.
 */
export function Landing() {
  const { t } = useTranslation()

  return (
    <AppShell header={<TopBar />} nav={<BottomNav />}>
      <PageIntro
        eyebrow={t('landing.eyebrow')}
        title={
          <Trans
            i18nKey="landing.title"
            components={{ accent: <span className="text-brand" /> }}
          />
        }
        subtitle={t('landing.subtitle')}
      />

      <p className="mb-5 max-w-[68ch] text-[14px] leading-[1.65] text-foreground md:mb-7 md:text-[16px]">
        {t('landing.about')}
      </p>

      {/* The club's own introduction, set apart from the description of the
          building so the two aren't read as one paragraph. */}
      <div className="mb-8 max-w-[68ch] rounded-2xl border-[0.5px] border-border bg-card p-5 md:mb-14 md:p-6">
        <p className="text-[15px] leading-[1.6] font-semibold text-card-foreground md:text-[17px]">
          {t('landing.club.who')}
        </p>
        <p className="mt-1.5 text-[14px] leading-[1.6] text-card-meta md:text-[15px]">
          {t('landing.club.academy')}
        </p>
        <p className="mt-3 text-[15px] font-semibold text-brand-accent md:text-base">
          {t('landing.club.welcome')}
        </p>
      </div>

      <VenueMap />

      <SocialLinks />

      <div className="flex flex-col gap-3 pb-2 sm:flex-row">
        <Button asChild size="lg" className="sm:w-auto">
          <Link to="/trainers">
            {t('landing.cta.trainers')}
            <ArrowRight className="size-4" strokeWidth={1.8} />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="sm:w-auto">
          <Link to="/gallery">{t('landing.cta.gallery')}</Link>
        </Button>
      </div>
    </AppShell>
  )
}
