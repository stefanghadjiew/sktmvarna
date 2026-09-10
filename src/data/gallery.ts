import { photoSizes } from '@/data/gallery-sizes'
import type { TranslationKey } from '@/i18n/types'

/**
 * Mosaic footprint. `wide`/`tall`/`big` break the grid out of uniform squares;
 * the grid uses dense auto-flow so the gaps they leave get backfilled.
 */
export type PhotoShape = 'square' | 'wide' | 'tall' | 'big'

export type Photo = {
  id: string
  src: string
  shape: PhotoShape
  /** Intrinsic size, so the browser reserves the right box before loading. */
  width: number
  height: number
}

export type GallerySection = {
  id: string
  titleKey: TranslationKey
  /** Used to build each photo's alt text: "<section> photo <n>". */
  altKey: TranslationKey
  photos: Photo[]
}

/**
 * The gallery is whatever is in these folders — dropping a photo into
 * `src/assets/<section>/` puts it on the page, no code change. Vite hashes and
 * copies the files at build time, so these are the built URLs.
 *
 * Run `npm run gallery:sizes` afterwards so the new photo gets its real
 * dimensions rather than the fallback box.
 */
const sources: Record<string, Record<string, string>> = {
  tournaments: import.meta.glob('../assets/tournaments/*.{jpg,jpeg,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
  hall: import.meta.glob('../assets/hall/*.{jpg,jpeg,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
  kids: import.meta.glob('../assets/kids/*.{jpg,jpeg,png,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
}

/** Landscape 4:3, the shape most of the photos turn out to be. */
const FALLBACK_SIZE: [number, number] = [1280, 960]

/**
 * Portraits take the tall slots, where they are the only shape that isn't
 * cropped to death. The landscapes would otherwise be a wall of identical
 * squares, so every few photos one is promoted to a wide or big footprint.
 */
function shapeFor(width: number, height: number, index: number): PhotoShape {
  if (height / width > 1.15) return 'tall'
  if (index % 9 === 3) return 'big'
  if (index % 4 === 1) return 'wide'
  return 'square'
}

function photosIn(section: string): Photo[] {
  // Filenames are timestamps, so sorting them puts the photos in the order
  // they were taken and keeps the mosaic stable between builds.
  return Object.keys(sources[section])
    .sort()
    .map((path, index) => {
      const file = path.slice(path.lastIndexOf('/') + 1)
      const [width, height] = photoSizes[`${section}/${file}`] ?? FALLBACK_SIZE
      return {
        id: `${section}/${file}`,
        src: sources[section][path],
        shape: shapeFor(width, height, index),
        width,
        height,
      }
    })
}

export const gallerySections: GallerySection[] = [
  {
    id: 'tournaments',
    titleKey: 'gallery.sections.tournaments',
    altKey: 'gallery.alt.tournaments',
    photos: photosIn('tournaments'),
  },
  {
    id: 'hall',
    titleKey: 'gallery.sections.hall',
    altKey: 'gallery.alt.hall',
    photos: photosIn('hall'),
  },
  {
    id: 'kids',
    titleKey: 'gallery.sections.kids',
    altKey: 'gallery.alt.kids',
    photos: photosIn('kids'),
  },
]
