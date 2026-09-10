import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PhotoGrid } from '@/components/gallery/photo-grid'
import { PhotoLightbox } from '@/components/gallery/photo-lightbox'
import { BottomNav } from '@/components/home/bottom-nav'
import { AppShell } from '@/components/layout/app-shell'
import { PageHeader } from '@/components/page-header'
import { PageIntro } from '@/components/page-intro'
import { gallerySections, type GallerySection } from '@/data/gallery'

type Viewing = { section: GallerySection; index: number }

export function Gallery() {
  const { t } = useTranslation()
  // The lightbox is scoped to one section, so tapping a hall photo pages
  // through hall photos rather than the whole gallery. `viewing` outlives the
  // close so the dialog can animate out before it unmounts.
  const [viewing, setViewing] = useState<Viewing | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const openViewer = (section: GallerySection, index: number) => {
    setViewing({ section, index })
    setIsViewerOpen(true)
  }

  return (
    <>
      <AppShell header={<PageHeader backTo="/" />} nav={<BottomNav />}>
        <PageIntro
          eyebrow={t('gallery.eyebrow')}
          title={t('gallery.title')}
          subtitle={t('gallery.subtitle')}
          className="mb-6"
        />

        {gallerySections.map((section, sectionIndex) => (
          <PhotoGrid
            key={section.id}
            section={section}
            eager={sectionIndex === 0}
            onOpen={(index) => openViewer(section, index)}
          />
        ))}
      </AppShell>

      <PhotoLightbox
        open={isViewerOpen}
        section={viewing?.section ?? null}
        startIndex={viewing?.index ?? 0}
        onOpenChange={setIsViewerOpen}
      />
    </>
  )
}
