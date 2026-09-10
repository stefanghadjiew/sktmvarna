import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { quickActions } from '@/data/home'
import { cn } from '@/lib/utils'

export function QuickActions() {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('home.quickActions')} className="mb-7 md:mb-14">
      {/* Hairline rows on a phone; from `md` the same three actions have room
          to become cards side by side. */}
      <ul className="flex flex-col gap-2 md:grid md:grid-cols-3 md:gap-5">
        {quickActions.map(({ id, labelKey, href, icon: Icon }, index) => (
          <li key={id} className="max-md:hairline-b">
            <Link
              to={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-1 py-3 transition-colors',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                'hover:bg-row-hover active:bg-row-active',
                index === 0 && 'max-md:pt-0',
                'md:h-full md:flex-col md:items-start md:gap-5 md:rounded-2xl',
                'md:border-[0.5px] md:border-border md:bg-card md:p-6',
                'md:hover:border-brand/40 md:hover:bg-card',
              )}
            >
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-brand-tint md:size-11 md:rounded-xl">
                <Icon
                  className="size-4 text-brand-icon md:size-5"
                  strokeWidth={1.8}
                />
              </span>
              <span className="flex-1 text-sm font-medium text-foreground md:flex-none md:text-base md:font-semibold">
                {t(labelKey)}
              </span>
              <ChevronRight
                className="size-4 shrink-0 text-chevron md:hidden"
                strokeWidth={1.8}
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
