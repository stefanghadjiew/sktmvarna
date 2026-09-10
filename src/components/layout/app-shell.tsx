import type { ReactNode } from 'react'

import { SiteHeader } from '@/components/layout/site-header'

/**
 * Two layouts, one component.
 *
 * Below `md` this is the phone screen from the designs: the page header and
 * the bottom nav are pinned and only the middle scrolls, so the nav stays
 * visible no matter how long the content is.
 *
 * From `md` up it becomes an ordinary web page — the sticky `SiteHeader`
 * replaces both pinned regions, the document scrolls normally, and content is
 * centred inside `max-w-content` (1440px). Pages narrow themselves further
 * where a full-width column would read badly.
 */
export function AppShell({
  header,
  children,
  nav,
}: {
  header?: ReactNode
  children: ReactNode
  nav?: ReactNode
}) {
  return (
    <div className="screen-surface flex h-dvh flex-col overflow-hidden md:h-auto md:min-h-dvh md:overflow-visible">
      <SiteHeader />

      {header ? (
        <div className="shrink-0 px-[22px] pt-6 md:hidden">{header}</div>
      ) : null}

      <main className="screen-scroll min-h-0 flex-1 px-[22px] md:px-8 md:py-12 lg:px-12">
        <div className="mx-auto w-full max-w-content">{children}</div>
      </main>

      {nav ? (
        <div className="shrink-0 px-[22px] pb-5 md:hidden">{nav}</div>
      ) : null}
    </div>
  )
}
