import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { VisuallyHidden } from 'radix-ui'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import type { GallerySection } from '@/data/gallery'

/**
 * Full-screen photo viewer. `section` is deliberately kept after closing so the
 * dialog's exit animation can play out; `open` alone drives visibility.
 */
export function PhotoLightbox({
  open,
  section,
  startIndex,
  onOpenChange,
}: {
  open: boolean
  section: GallerySection | null
  startIndex: number
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {section ? (
        // Remounting per opening lets the slide index initialise straight from
        // props instead of being synced into state by an effect.
        <LightboxView
          key={`${section.id}:${startIndex}`}
          section={section}
          startIndex={startIndex}
        />
      ) : null}
    </Dialog>
  )
}

/**
 * The track is a native scroll-snap carousel, so touch swipe and trackpad
 * flicks come free with the platform's own physics; the arrow buttons and the
 * keyboard just drive the same scroll position.
 */
function LightboxView({
  section,
  startIndex,
}: {
  section: GallerySection
  startIndex: number
}) {
  const { t } = useTranslation()
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(startIndex)

  const { photos, titleKey, altKey } = section
  const total = photos.length

  const scrollToIndex = useCallback(
    (next: number, behavior: ScrollBehavior = 'smooth') => {
      const track = trackRef.current
      if (!track) return
      const clamped = Math.max(0, Math.min(next, total - 1))
      track.scrollTo({ left: clamped * track.clientWidth, behavior })
    },
    [total],
  )

  // Jump to the tapped photo once the track has been laid out and has a width.
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      scrollToIndex(startIndex, 'instant'),
    )
    return () => cancelAnimationFrame(frame)
  }, [startIndex, scrollToIndex])

  const handleScroll = () => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    setIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollToIndex(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollToIndex(index - 1)
    }
  }

  return (
    <DialogContent
      showCloseButton={false}
      onKeyDown={handleKeyDown}
      className="top-0 left-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-black/95 p-0 sm:max-w-none"
    >
      <VisuallyHidden.Root>
        <DialogTitle>
          {t('gallery.viewer.label', { section: t(titleKey) })}
        </DialogTitle>
      </VisuallyHidden.Root>

      <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-2">
        <span
          aria-live="polite"
          className="text-xs font-medium text-white/70 tabular-nums"
        >
          {t('gallery.viewer.counter', { index: index + 1, total })}
        </span>
        <DialogClose
          aria-label={t('gallery.viewer.close')}
          className="flex size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
        >
          <X className="size-5" strokeWidth={1.8} />
        </DialogClose>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, photoIndex) => (
          <div
            key={photo.id}
            className="flex w-full shrink-0 snap-center items-center justify-center p-4"
          >
            <img
              src={photo.src}
              alt={t(altKey, { index: photoIndex + 1 })}
              width={photo.width}
              height={photo.height}
              loading={photoIndex === startIndex ? 'eager' : 'lazy'}
              decoding="async"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>

      <div className="flex shrink-0 items-center justify-center gap-6 px-4 pt-2 pb-6">
        <NavButton
          label={t('gallery.viewer.previous')}
          disabled={index === 0}
          onClick={() => scrollToIndex(index - 1)}
        >
          <ChevronLeft className="size-5" strokeWidth={1.8} />
        </NavButton>
        <NavButton
          label={t('gallery.viewer.next')}
          disabled={index >= total - 1}
          onClick={() => scrollToIndex(index + 1)}
        >
          <ChevronRight className="size-5" strokeWidth={1.8} />
        </NavButton>
      </div>
    </DialogContent>
  )
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-white/10"
    >
      {children}
    </button>
  )
}
