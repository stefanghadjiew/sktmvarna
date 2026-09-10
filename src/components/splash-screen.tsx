import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Logo } from '@/components/logo'
import { BOOT_FADE_MS, BOOT_MIN_MS } from '@/hooks/use-app-boot'
import { cn } from '@/lib/utils'

/**
 * The bar crawls to 90% over the boot and only closes the last stretch once
 * booting actually finishes — so it stays honest when the wait stops being a
 * fixed timer and becomes real requests of unknown length.
 */
const CRAWL_TO = 90

export function SplashScreen({ leaving }: { leaving: boolean }) {
  const { t } = useTranslation()
  // Painting at 0 first and moving on the next frame is what gives the bar
  // something to transition from.
  const [crawling, setCrawling] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setCrawling(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const progress = leaving ? 100 : crawling ? CRAWL_TO : 0

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={t('splash.loading')}
      className={cn(
        'screen-surface fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 px-8',
        'transition-opacity ease-out motion-reduce:transition-none',
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
      style={{ transitionDuration: `${BOOT_FADE_MS}ms` }}
    >
      <Logo className="size-24 animate-in rounded-[28px] duration-700 fade-in zoom-in-95 md:size-28" />

      <div className="animate-in text-center delay-150 duration-700 fade-in slide-in-from-bottom-2 fill-mode-backwards">
        <p className="text-[19px] font-bold tracking-[-0.3px] text-foreground md:text-[22px]">
          {t('splash.title')}
        </p>
        <p className="mt-1.5 max-w-[34ch] text-[13px] leading-[1.5] text-muted-foreground md:text-sm">
          {t('splash.tagline')}
        </p>
      </div>

      <div
        aria-hidden="true"
        className="h-[3px] w-40 overflow-hidden rounded-full bg-track md:w-48"
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] ease-out motion-reduce:transition-none"
          style={{
            width: `${progress}%`,
            // The crawl is paced to the boot; closing to 100% is a quick beat.
            transitionDuration: leaving ? '250ms' : `${BOOT_MIN_MS}ms`,
          }}
        />
      </div>
    </div>
  )
}
