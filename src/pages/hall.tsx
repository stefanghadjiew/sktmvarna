import { ArrowRight } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { FacilitiesList } from '@/components/complex/facilities-list'
import { OpeningHoursList } from '@/components/complex/opening-hours'
import { PhotoStrip } from '@/components/gallery/photo-strip'
import { BottomNav } from '@/components/home/bottom-nav'
import { ContactPhone } from '@/components/landing/contact-phone'
import { SocialLinks } from '@/components/landing/social-links'
import { VenueMap } from '@/components/landing/venue-map'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'
import { SectionHeading } from '@/components/section-heading'
import { Button } from '@/components/ui/button'
import { photoSelection } from '@/data/gallery'
import { usePageMeta } from '@/hooks/use-page-meta'

const hallPhotos = photoSelection('hall-page', [
  ['hall', 0],
  ['hall', 2],
  ['hall', 4],
  ['hall', 7],
  ['hall', 10],
  ['hall', 14],
  ['hall', 16],
])

/** /hall — Спортен комплекс „Варна“, the building: what's in it, when it's open, where it is. */
export function Hall() {
  const { t } = useTranslation()
  usePageMeta('hall')

  return (
    <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
      <PageIntro
        eyebrow={t('hall.eyebrow')}
        title={<Trans i18nKey="hall.title" components={{ accent: <span className="text-brand" /> }} />}
        subtitle={t('hall.subtitle')}
      />

      <p className="mb-8 max-w-[68ch] text-[14px] leading-[1.65] text-foreground md:mb-12 md:text-[16px]">
        {t('hall.about')}
      </p>

      <div className="mb-8 grid gap-3 md:mb-14 md:grid-cols-2 md:gap-5">
        <section className="rounded-2xl border-[0.5px] border-border bg-card p-5 md:p-6">
          <SectionHeading>{t('hall.facilitiesHeading')}</SectionHeading>
          <FacilitiesList />
          <Button asChild className="mt-6 rounded-xl bg-brand text-white hover:bg-brand-accent">
            <Link to="/reserve">
              {t('home.hero.reserve')}
              <ArrowRight className="size-4" strokeWidth={1.8} />
            </Link>
          </Button>
        </section>
        <section className="rounded-2xl border-[0.5px] border-border bg-card p-5 md:p-6">
          <SectionHeading>{t('complex.hours.heading')}</SectionHeading>
          <OpeningHoursList />
        </section>
      </div>

      <section className="mb-8 md:mb-14">
        <SectionHeading action={{ to: '/gallery', label: t('home.atmosphere.seeAll') }}>
          {t('hall.photosHeading')}
        </SectionHeading>
        <PhotoStrip section={hallPhotos} />
      </section>

      <ContactPhone />
      <VenueMap />
      <SocialLinks />
    </AppShell>
  )
}
