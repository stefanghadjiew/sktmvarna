import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * The eyebrow / title / subtitle block every screen opens with. Owns the one
 * responsive type ramp so the headings grow together on wider screens instead
 * of each page inventing its own.
 */
export function PageIntro({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  className?: string
}) {
  return (
    <section className={cn('mb-[22px] md:mb-10', className)}>
      <p className="mb-2 text-[11px] font-semibold tracking-[1.2px] text-brand-accent uppercase md:text-xs">
        {eyebrow}
      </p>
      <h1 className="text-[30px] leading-[1.1] font-bold tracking-[-0.5px] text-foreground md:text-[42px] md:tracking-[-1px] lg:text-[52px]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1.5 max-w-[60ch] text-[13px] leading-[1.5] text-muted-foreground md:mt-3 md:text-[15px] md:leading-[1.6]">
          {subtitle}
        </p>
      ) : null}
    </section>
  )
}
