import { CalendarCheck, Trophy } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import heroPhoto from '@/assets/hall/photo_2026-09-10_09-58-04.jpg'
import { Button } from '@/components/ui/button'
import { TABLE_COUNT } from '@/data/complex'

/**
 * First screen: what this is (table tennis in Varna, 14 tables, coaching,
 * tournaments) over a photo of the hall in use, and the two things most
 * visitors came to do.
 */
export function HomeHero() {
  const { t } = useTranslation()

  return (
    <section className="relative isolate mb-6 overflow-hidden rounded-3xl md:mb-10">
      <img
        src={heroPhoto}
        alt={t('home.hero.imageAlt')}
        width={1000}
        height={667}
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/25 md:bg-gradient-to-r md:from-black/85 md:via-black/55 md:to-black/5"
      />

      <div className="flex min-h-[420px] flex-col justify-end p-5 text-white md:min-h-[520px] md:max-w-[720px] md:justify-center md:p-12 lg:min-h-[580px] lg:p-16">
        <p className="mb-3 text-[11px] font-semibold tracking-[1.2px] text-white/80 uppercase md:text-xs">
          {t('home.hero.eyebrow')}
        </p>
        <h1 className="text-[34px] leading-[1.05] font-bold tracking-[-0.5px] md:text-[52px] md:tracking-[-1px] lg:text-[64px]">
          <Trans
            i18nKey="home.hero.title"
            components={{ accent: <span className="text-[#ff6b63]" /> }}
          />
        </h1>
        <p className="mt-3 text-[15px] font-semibold tracking-[0.2px] text-white md:text-[19px]">
          {t('home.hero.tagline', { count: TABLE_COUNT })}
        </p>
        <p className="mt-2 max-w-[52ch] text-[13px] leading-[1.55] text-white/80 md:text-[15px]">
          {t('home.hero.body')}
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row md:mt-8">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-xl bg-brand px-6 text-[15px] font-semibold text-white hover:bg-brand-accent"
          >
            <Link to="/reserve">
              <CalendarCheck className="size-[18px]" strokeWidth={1.8} />
              {t('home.hero.reserve')}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-xl border-white/40 bg-white/10 px-6 text-[15px] font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white dark:border-white/40 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <Link to="/tournaments">
              <Trophy className="size-[18px]" strokeWidth={1.8} />
              {t('home.hero.tournaments')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
