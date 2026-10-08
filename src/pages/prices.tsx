import { ArrowRight } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'
import { Button } from '@/components/ui/button'
import { contactPhone } from '@/data/contact'
import { priceGroups } from '@/data/complex'
import { useFormatters } from '@/hooks/use-formatters'
import { usePageMeta } from '@/hooks/use-page-meta'
import { cn } from '@/lib/utils'

export function Prices() {
  const { t } = useTranslation()
  const { euro } = useFormatters()
  usePageMeta('prices')
  const nothingPublished = priceGroups.every((group) => group.rows.every((row) => row.amount === null))

  return (
    <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
      <PageIntro
        eyebrow={t('prices.eyebrow')}
        title={<Trans i18nKey="prices.title" components={{ accent: <span className="text-brand" /> }} />}
        subtitle={t('prices.subtitle')}
      />

      {nothingPublished ? (
        <p className="mb-6 max-w-[720px] rounded-xl bg-inset px-4 py-3 text-[14px] text-foreground">
          {t('prices.pending', { phone: contactPhone.display })}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3 md:gap-5">
        {priceGroups.map((group) => (
          <section key={group.id} className="flex flex-col rounded-2xl border-[0.5px] border-border bg-card p-5 md:p-6">
            <p
              className={cn(
                'mb-1 text-[10px] font-semibold tracking-[1px] uppercase',
                group.owner === 'club' ? 'text-muted-foreground' : 'text-brand-accent',
              )}
            >
              {t(`prices.owner.${group.owner}`)}
            </p>
            <h2 className="mb-4 text-[18px] font-bold text-card-foreground">{t(group.titleKey)}</h2>
            <dl className="mb-5">
              {group.rows.map((row, index) => (
                <div key={row.id} className={cn('flex items-baseline justify-between gap-3 py-2.5', index > 0 && 'kv-line-t')}>
                  <dt className="text-[14px] text-card-foreground">{t(row.labelKey)}</dt>
                  <dd className="text-right">
                    <span className="block text-[15px] font-bold text-card-foreground tabular-nums">
                      {row.amount === null ? t('common.onRequest') : euro.format(row.amount)}
                    </span>
                    {row.amount !== null ? (
                      <span className="block text-[11px] text-meta">{t(row.unitKey)}</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
            <Button asChild variant="outline" className="mt-auto self-start">
              <Link to={group.id === 'coaching' ? '/trainers' : group.id === 'tournaments' ? '/tournaments' : '/reserve'}>
                {group.id === 'coaching'
                  ? t('prices.coachingCta')
                  : group.id === 'tournaments'
                    ? t('nav.tournaments')
                    : t('prices.reserveCta')}
                <ArrowRight className="size-4" strokeWidth={1.8} />
              </Link>
            </Button>
          </section>
        ))}
      </div>
    </AppShell>
  )
}
