import { ExternalLink, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { venueEmbedUrl, venueMapsUrl } from '@/data/venue'

/**
 * The hall's location: the map on the wide side, the address and directions
 * link alongside it from `lg` up, stacked below that.
 */
export function VenueMap() {
  const { t, i18n } = useTranslation()

  return (
    <section className="mb-8 md:mb-14">
      <h2 className="mb-3 text-[11px] font-semibold tracking-[1px] text-label uppercase md:mb-5 md:text-xs">
        {t('landing.location.heading')}
      </h2>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch lg:gap-8">
        <div className="overflow-hidden rounded-2xl border-[0.5px] border-border bg-card">
          <iframe
            // `key` forces a reload when the language changes, so the map's own
            // labels follow the interface instead of staying on first paint.
            key={i18n.resolvedLanguage}
            title={t('landing.location.mapTitle')}
            src={venueEmbedUrl(i18n.resolvedLanguage ?? 'bg')}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="block aspect-[4/3] w-full border-0 md:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[340px]"
          />
        </div>

        <div className="mt-4 flex flex-col items-start gap-4 rounded-2xl border-[0.5px] border-border bg-card p-5 lg:mt-0 lg:p-6">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-tint">
            <MapPin className="size-5 text-brand-icon" strokeWidth={1.8} />
          </span>

          <div>
            <p className="text-[11px] font-semibold tracking-[1px] text-label uppercase">
              {t('landing.location.addressLabel')}
            </p>
            <p className="mt-1.5 text-[15px] leading-[1.5] font-semibold text-card-foreground">
              {t('landing.location.address')}
            </p>
            <p className="mt-1 text-[13px] leading-[1.5] text-card-meta">
              {t('landing.location.landmark')}
            </p>
          </div>

          <Button asChild variant="outline" className="mt-auto w-full">
            <a href={venueMapsUrl()} target="_blank" rel="noreferrer noopener">
              {t('landing.location.openInMaps')}
              <ExternalLink className="size-4" strokeWidth={1.8} />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
