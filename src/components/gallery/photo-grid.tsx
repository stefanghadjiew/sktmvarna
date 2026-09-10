import { useTranslation } from 'react-i18next'

import type { GallerySection, PhotoShape } from '@/data/gallery'

/**
 * Mosaic footprints. Combined with `grid-flow-dense`, the mixed spans give the
 * varied layout the uniform-square grid was missing, and the grid backfills
 * any holes they leave rather than stranding gaps.
 */
const SHAPE_SPANS: Record<PhotoShape, string> = {
  square: 'col-span-1 row-span-1',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  big: 'col-span-2 row-span-2',
}

export function PhotoGrid({
  section,
  onOpen,
  eager = false,
}: {
  section: GallerySection
  onOpen: (index: number) => void
  eager?: boolean
}) {
  const { t } = useTranslation()
  const { titleKey, altKey, photos } = section

  return (
    <section className="mb-6 md:mb-12">
      <div className="mb-3 flex items-baseline justify-between gap-3 md:mb-4">
        <h2 className="text-[11px] font-semibold tracking-[1px] text-label uppercase md:text-xs">
          {t(titleKey)}
        </h2>
        <span className="text-[11px] text-meta">
          {t('gallery.photos', { count: photos.length })}
        </span>
      </div>

      <ul className="grid grid-flow-row-dense auto-rows-[80px] grid-cols-3 gap-1.5 md:auto-rows-[130px] md:grid-cols-4 md:gap-3 lg:auto-rows-[150px] lg:grid-cols-6 xl:auto-rows-[170px]">
        {photos.map((photo, index) => {
          const alt = t(altKey, { index: index + 1 })
          return (
            <li key={photo.id} className={SHAPE_SPANS[photo.shape]}>
              <button
                type="button"
                onClick={() => onOpen(index)}
                aria-label={t('gallery.viewer.open', { index: index + 1 })}
                className="group size-full overflow-hidden rounded-lg bg-inset focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:rounded-xl"
              >
                <img
                  src={photo.src}
                  alt={alt}
                  width={photo.width}
                  height={photo.height}
                  loading={eager && index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
