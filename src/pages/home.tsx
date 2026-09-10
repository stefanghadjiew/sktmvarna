import { AppShell } from '@/components/layout/app-shell'
import { BottomNav } from '@/components/home/bottom-nav'
import { Hero } from '@/components/home/hero'
import { NextUpCard } from '@/components/home/next-up-card'
import { QuickActions } from '@/components/home/quick-actions'
import { TopBar } from '@/components/home/top-bar'
import { nextTournament } from '@/data/home'

export function Home() {
  return (
    <AppShell header={<TopBar />} nav={<BottomNav />}>
      <Hero />
      <QuickActions />
      <NextUpCard tournament={nextTournament} />
    </AppShell>
  )
}
