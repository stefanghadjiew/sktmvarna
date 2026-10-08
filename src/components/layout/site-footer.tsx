import { Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { contactPhone } from '@/data/contact'

const linkClass =
  'rounded-sm text-[13px] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'

/**
 * Keeps the two organisations apart even at the bottom of the page: the
 * complex (the hall) and the club each get their own column and links.
 */
export function SiteFooter() {
  const { t } = useTranslation()

  return (
    <footer className="hairline-t mt-12 grid gap-8 pt-8 pb-6 sm:grid-cols-3 md:mt-20 md:pt-10">
      <div>
        <p className="text-[13px] font-semibold text-foreground">{t('footer.complex')}</p>
        <p className="mt-1 text-[13px] text-muted-foreground">{t('footer.complexBody')}</p>
        <ul className="mt-3 flex flex-col gap-1.5">
          <li><Link to="/reserve" className={linkClass}>{t('nav.reserve')}</Link></li>
          <li><Link to="/tournaments" className={linkClass}>{t('nav.tournaments')}</Link></li>
          <li><Link to="/prices" className={linkClass}>{t('nav.prices')}</Link></li>
          <li><Link to="/hall" className={linkClass}>{t('nav.hall')}</Link></li>
        </ul>
      </div>

      <div>
        <p className="text-[13px] font-semibold text-foreground">{t('footer.club')}</p>
        <p className="mt-1 text-[13px] text-muted-foreground">{t('footer.clubBody')}</p>
        <ul className="mt-3 flex flex-col gap-1.5">
          <li><Link to="/club" className={linkClass}>{t('nav.club')}</Link></li>
          <li><Link to="/trainers" className={linkClass}>{t('nav.coaching')}</Link></li>
        </ul>
      </div>

      <div>
        <p className="text-[13px] font-semibold text-foreground">{t('footer.links')}</p>
        <ul className="mt-3 flex flex-col gap-1.5">
          <li><Link to="/gallery" className={linkClass}>{t('footer.gallery')}</Link></li>
          <li><Link to="/reserve/my" className={linkClass}>{t('footer.myBookings')}</Link></li>
          <li>
            <a href={`tel:${contactPhone.tel}`} className={`${linkClass} inline-flex items-center gap-1.5`}>
              <Phone className="size-3.5" strokeWidth={1.8} />
              {contactPhone.display}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
