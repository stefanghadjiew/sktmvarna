import { Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { contactPhone } from '@/data/contact'

/** The number to call the club on, with a tap-to-call button on phones. */
export function ContactPhone() {
  const { t } = useTranslation()

  return (
    <section className="mb-8 md:mb-14">
      <h2 className="mb-3 text-[11px] font-semibold tracking-[1px] text-label uppercase md:mb-5 md:text-xs">
        {t('landing.contact.heading')}
      </h2>

      <div className="flex flex-col gap-4 rounded-2xl border-[0.5px] border-border bg-card p-4 sm:flex-row sm:items-center md:p-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint md:size-11">
            <Phone className="size-5 text-brand-icon" strokeWidth={1.8} />
          </span>

          <span className="min-w-0">
            <span className="block text-[11px] font-semibold tracking-[1px] text-label uppercase">
              {t('landing.contact.phoneLabel')}
            </span>
            <a
              href={`tel:${contactPhone.tel}`}
              className="mt-0.5 block text-[15px] font-semibold text-card-foreground hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:text-[17px]"
            >
              {contactPhone.display}
            </a>
          </span>
        </div>

        <Button asChild variant="outline" className="sm:w-auto">
          <a href={`tel:${contactPhone.tel}`}>
            <Phone className="size-4" strokeWidth={1.8} />
            {t('landing.contact.call')}
          </a>
        </Button>
      </div>
    </section>
  )
}
