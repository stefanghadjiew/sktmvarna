import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { cn } from '@/lib/utils'

/** The small uppercase label that opens each block, with an optional link. */
export function SectionHeading({
  children,
  action,
  className,
  id,
}: {
  children: ReactNode
  action?: { to: string; label: string }
  className?: string
  id?: string
}) {
  return (
    <div className={cn('mb-3 flex items-baseline justify-between gap-3 md:mb-5', className)}>
      <h2
        id={id}
        className="text-[11px] font-semibold tracking-[1px] text-label uppercase md:text-xs"
      >
        {children}
      </h2>
      {action ? (
        <Link
          to={action.to}
          className="shrink-0 rounded-sm text-xs font-semibold text-brand-accent hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {action.label} →
        </Link>
      ) : null}
    </div>
  )
}
