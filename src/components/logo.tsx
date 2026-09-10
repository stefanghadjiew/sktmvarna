import logoDark from '@/assets/logo/logo-dark-theme.jpg'
import logoLight from '@/assets/logo/logo-light-theme.jpg'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

/**
 * The club badge. Each theme gets its own file rather than one mark recoloured
 * by CSS, because both artworks are JPEGs with their own solid background
 * baked in — red for light, black for dark.
 *
 * Decorative on purpose: every call site already wraps this in a link that
 * carries its own label, so an alt text here would just be announced twice.
 */
export function Logo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <span className={cn('block shrink-0 overflow-hidden rounded-lg', className)}>
      <img
        src={isDark ? logoDark : logoLight}
        alt=""
        width={1280}
        height={1280}
        className={cn(
          'size-full object-cover',
          // The dark artwork has roughly a quarter of empty margin around the
          // shield; the light one is edge to edge. Scaling the dark file up
          // crops that margin away so the two read at the same weight.
          isDark && 'scale-[1.55]',
        )}
      />
    </span>
  )
}
