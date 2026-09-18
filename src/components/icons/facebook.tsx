import type { SVGProps } from 'react'

/**
 * The Facebook "f" glyph. Lucide dropped its brand icons, so this one is a
 * filled path drawn to sit on the same 24px grid as the stroked icons around
 * it — it takes its colour from `currentColor` like the rest.
 */
export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22C18.34 21.24 22 17.08 22 12.06Z" />
    </svg>
  )
}
