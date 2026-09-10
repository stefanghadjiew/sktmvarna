import type { SVGProps } from 'react'

/**
 * Side view of a table tennis table with its net line. Lucide has no
 * equivalent, so this one is drawn to match the BAPHA design directly.
 */
export function TableTennisTableIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="8" width="18" height="8" rx="1" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  )
}
