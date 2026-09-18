import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { FacebookIcon } from '@/components/icons/facebook'
import { facebookLinks } from '@/data/social'

/**
 * The club keeps two Facebook pages — one for the hall and one for the club —
 * so both get a row rather than a single ambiguous "follow us" link.
 */
export function SocialLinks() {
  const { t } = useTranslation()

  return (
    <section className="mb-8 md:mb-14">
      <h2 className="mb-3 text-[11px] font-semibold tracking-[1px] text-label uppercase md:mb-5 md:text-xs">
        {t('landing.social.heading')}
      </h2>

      <ul className="grid gap-3 sm:grid-cols-2 md:gap-5">
        {facebookLinks.map(({ id, labelKey, descriptionKey, href }) => (
          <li key={id}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-full items-center gap-4 rounded-2xl border-[0.5px] border-border bg-card p-4 transition-colors hover:border-brand/40 hover:bg-row-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint md:size-11">
                <FacebookIcon className="size-5 text-brand-icon" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-card-foreground">
                  {t(labelKey)}
                </span>
                <span className="mt-0.5 block text-[13px] leading-[1.5] text-card-meta">
                  {t(descriptionKey)}
                </span>
              </span>

              <ArrowUpRight
                className="size-4 shrink-0 text-chevron"
                strokeWidth={1.8}
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
