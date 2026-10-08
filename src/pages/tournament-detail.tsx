import { CalendarDays, ExternalLink, Layers, Ticket, Users } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'

import { DemoNotice } from '@/components/demo-notice'
import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'
import { SectionHeading } from '@/components/section-heading'
import { TextField } from '@/components/text-field'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useFormatters } from '@/hooks/use-formatters'
import { usePageMeta } from '@/hooks/use-page-meta'
import {
  findTournament,
  isDemoRegistration,
  isRegistrationOpen,
  registerForTournament,
  spotsLeft,
  type Tournament,
} from '@/lib/tournaments'

/**
 * /tournaments/:id — everything about one tournament on our own page: date,
 * format, fee, spots left, who has signed up, and a short form to join.
 */
export function TournamentDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const tournament = findTournament(id)
  const { longDate, time } = useFormatters()

  const start = tournament ? new Date(tournament.startsAt) : null
  usePageMeta(
    tournament ? 'tournaments' : 'notFound',
    tournament && start
      ? {
          title: t('seo.tournament.title', {
            name: tournament.name,
            date: start.toLocaleDateString('bg-BG'),
          }),
          description: tournament.description ?? t('seo.tournament.description'),
        }
      : undefined,
  )

  if (!tournament || !start) {
    return (
      <AppShell header={<PageHeader backTo="/tournaments" />} nav={<BottomNav />}>
        <PageIntro eyebrow={t('tournaments.eyebrow')} title={t('tournaments.notFound')} />
        <Button asChild variant="outline">
          <Link to="/tournaments">{t('tournaments.backToList')}</Link>
        </Button>
      </AppShell>
    )
  }

  const left = spotsLeft(tournament)
  const facts: { icon: ReactNode; label: string; value: string }[] = [
    {
      icon: <CalendarDays className="size-4" strokeWidth={1.8} />,
      label: t('tournaments.fields.date'),
      value: `${longDate.format(start)} · ${time.format(start)}`,
    },
    {
      icon: <Layers className="size-4" strokeWidth={1.8} />,
      label: t('tournaments.fields.format'),
      value: [tournament.format, tournament.level].filter(Boolean).join(' · ') || '—',
    },
    {
      icon: <Ticket className="size-4" strokeWidth={1.8} />,
      label: t('tournaments.fields.fee'),
      value: tournament.fee ?? t('tournaments.feeAtHall'),
    },
    {
      icon: <Users className="size-4" strokeWidth={1.8} />,
      label: t('tournaments.fields.spots'),
      value:
        left === null
          ? String(tournament.spotsTaken)
          : left === 0
            ? t('tournaments.full')
            : `${left} / ${tournament.spotsTotal}`,
    },
  ]

  return (
    <AppShell header={<PageHeader backTo="/tournaments" />} nav={<BottomNav />}>
      <Link
        to="/tournaments"
        className="mb-4 hidden rounded-sm text-[13px] font-semibold text-brand-accent hover:opacity-80 md:inline-block"
      >
        ← {t('tournaments.backToList')}
      </Link>

      <div className="mb-3">
        <Badge variant={tournament.status === 'open' ? 'success' : 'secondary'} className="rounded-md px-2 py-1 text-[10px] font-semibold">
          {t(`tournaments.status.${tournament.status}`)}
        </Badge>
      </div>
      <PageIntro
        eyebrow={t('tournaments.eyebrow')}
        title={tournament.name}
        subtitle={tournament.description ?? undefined}
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
        <div>
          <dl className="mb-6 grid gap-2 sm:grid-cols-2 md:mb-10 md:gap-3">
            {facts.map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 rounded-2xl border-[0.5px] border-border bg-card p-4">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand-icon">
                  {icon}
                </span>
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold tracking-[0.8px] text-label uppercase">{label}</dt>
                  <dd className="mt-0.5 text-[14px] font-semibold text-card-foreground first-letter:uppercase">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          {tournament.spotsTotal ? (
            <Progress
              value={Math.round((tournament.spotsTaken / tournament.spotsTotal) * 100)}
              aria-label={t('tournaments.spotsLabel', { taken: tournament.spotsTaken, total: tournament.spotsTotal })}
              className="mb-8 h-[6px] rounded-[3px] bg-track"
            />
          ) : null}

          <PlayerList tournament={tournament} />
        </div>

        <RegistrationForm tournament={tournament} />
      </div>
    </AppShell>
  )
}

function PlayerList({ tournament }: { tournament: Tournament }) {
  const { t } = useTranslation()
  const { players } = tournament

  return (
    <section className="mb-8">
      <SectionHeading>
        {t('tournaments.players.heading')} · {players.length}
      </SectionHeading>
      {players.length === 0 ? (
        <p className="text-[14px] text-muted-foreground">{t('tournaments.players.empty')}</p>
      ) : (
        <ol className="rounded-2xl border-[0.5px] border-border bg-card px-4">
          {players.map((player, index) => (
            <li key={`${player.name}-${index}`} className="hairline-b flex items-center gap-3 py-2.5 last:border-b-0">
              <span className="w-6 text-right text-[12px] font-bold text-rank tabular-nums">{index + 1}</span>
              <span className="flex-1 truncate text-[14px] font-medium text-foreground">{player.name}</span>
              {player.rating !== null ? (
                <span className="text-[13px] font-semibold text-muted-foreground tabular-nums" aria-label={`${t('tournaments.players.rating')} ${player.rating}`}>
                  {player.rating}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function RegistrationForm({ tournament }: { tournament: Tournament }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string; form?: string }>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const open = isRegistrationOpen(tournament)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const next: typeof errors = {}
    if (name.trim().split(/\s+/).length < 2) next.name = t('tournaments.register.errorName')
    if (phone.replace(/\D/g, '').length < 6) next.phone = t('tournaments.register.errorPhone')
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setState('sending')
    try {
      await registerForTournament({ tournamentId: tournament.id, name: name.trim(), phone: phone.trim() })
      setState('done')
    } catch {
      setErrors({ form: t('tournaments.register.error') })
      setState('idle')
    }
  }

  return (
    <aside className="rounded-2xl border-[0.5px] border-border bg-card p-5 lg:sticky lg:top-24">
      <SectionHeading className="md:mb-4">{t('tournaments.register.heading')}</SectionHeading>

      {!open ? (
        <p className="text-[14px] text-muted-foreground">{t('tournaments.register.closed')}</p>
      ) : state === 'done' ? (
        <div role="status" className="flex flex-col gap-3">
          <p className="text-[15px] font-semibold text-success">
            {isDemoRegistration ? t('tournaments.register.successDemo') : t('tournaments.register.success')}
          </p>
          {isDemoRegistration ? <TournirLink tournament={tournament} /> : null}
        </div>
      ) : (
        <form noValidate onSubmit={submit} className="flex flex-col gap-3">
          {isDemoRegistration ? <DemoNotice kind="tournament" /> : null}
          <TextField
            label={t('tournaments.register.name')}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors.name}
          />
          <TextField
            label={t('tournaments.register.phone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            error={errors.phone}
          />
          {errors.form ? (
            <p role="alert" className="text-[13px] font-medium text-destructive">
              {errors.form}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={state === 'sending'}
            className="mt-1 h-11 rounded-xl bg-brand font-semibold text-white hover:bg-brand-accent"
          >
            {state === 'sending' ? t('tournaments.register.submitting') : t('tournaments.register.submit')}
          </Button>
        </form>
      )}
    </aside>
  )
}

/** Deep link to this tournament's own Tournir page — never Tournir's home. */
function TournirLink({ tournament }: { tournament: Tournament }) {
  const { t } = useTranslation()
  return (
    <Button asChild variant="outline" className="h-11 rounded-xl">
      <a href={tournament.sourceUrl} target="_blank" rel="noreferrer noopener">
        {t('tournaments.register.finishOnTournir')}
        <ExternalLink className="size-4" strokeWidth={1.8} />
      </a>
    </Button>
  )
}
