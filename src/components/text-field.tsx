import { useId, type ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/** Label, input, hint and error wired together for assistive tech. */
export function TextField({
  label,
  hint,
  error,
  className,
  ...inputProps
}: ComponentProps<'input'> & { label: string; hint?: string; error?: string | null }) {
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-foreground">
        {label}
      </label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn('h-11 rounded-xl bg-card px-3.5 text-[15px] md:text-[15px]')}
        {...inputProps}
      />
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[12px] text-meta">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-[12px] font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
