import { cn } from '@/lib/utils'

/**
 * Rounded-square initials tile. Deliberately not the shadcn `Avatar` — these
 * never carry a photo, so the Radix image-loading machinery buys nothing and
 * the circular default would have to be overridden at every call site.
 */
export function InitialsTile({
  initials,
  variant = 'muted',
  className,
}: {
  initials: string
  variant?: 'brand' | 'muted'
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center font-semibold',
        variant === 'brand'
          ? 'avatar-gradient size-16 rounded-2xl text-[22px] font-bold text-white'
          : 'size-[38px] rounded-[10px] bg-secondary text-[13px] text-chip-foreground',
        className,
      )}
    >
      {initials}
    </span>
  )
}
