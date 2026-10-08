import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PhotoLightbox } from '@/components/gallery/photo-lightbox'
import type { GallerySection } from '@/data/gallery'
import { cn } from '@/lib/utils'

/**
 * A few gallery photos set into a page — the first one large, the rest in a
 * grid beside it — opening the same full-screen viewer as the gallery.
 */
export function PhotoStrip({
  section,
  className,
}: {
  section: GallerySection
  className?: string
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)

  return (
    <>
      <ul
        className={cn(
          'grid auto-rows-[110px] grid-cols-2 gap-1.5 sm:auto-rows-[140px] sm:grid-cols-4 md:gap-3 lg:auto-rows-[170px]',
          className,
        )}
      >
        {section.photos.map((photo, index) => (
          <li
            key={photo.id}
            className={cn(index === 0 && 'col-span-2 row-span-2', index > 4 && 'max-sm:hidden')}
          >
            <button
              type="button"
              onClick={() => {
                setStartIndex(index)
                setOpen(true)
              }}
              aria-label={t('gallery.viewer.open', { index: index + 1 })}
              className="group size-full overflow-hidden rounded-xl bg-inset focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <img
                src={photo.src}
                alt={t(section.altKey, { index: index + 1 })}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </ul>

      <PhotoLightbox
        open={open}
        section={section}
        startIndex={startIndex}
        onOpenChange={setOpen}
      />
    </>
  )
}
