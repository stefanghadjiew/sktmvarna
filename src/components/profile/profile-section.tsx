import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function ProfileSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'mb-4 rounded-2xl border-[0.5px] border-surface-border bg-surface p-4 md:mb-6 md:p-6',
        className,
      )}
    >
      <h2 className="mb-2.5 text-sm font-semibold text-card-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}
