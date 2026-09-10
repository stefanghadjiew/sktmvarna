import { useEffect, useState } from 'react'

/**
 * How long the splash stays up. Nothing is fetched at startup yet, so right
 * now this is the whole of "booting"; once there is real work it becomes the
 * floor, so a fast connection still gets a readable splash instead of a flash.
 */
export const BOOT_MIN_MS = 2000

/** Length of the fade-out. Must match the transition in `SplashScreen`. */
export const BOOT_FADE_MS = 400

/**
 * Everything that has to land before the app is usable.
 *
 * When there is something real to wait for — a session, the tournament list,
 * the rankings — add it to this array. `Promise.all` means the splash stays up
 * until the slowest one resolves, and the timer keeps it up for at least
 * `BOOT_MIN_MS` either way.
 */
function bootstrap(): Promise<unknown> {
  return Promise.all([
    new Promise((resolve) => setTimeout(resolve, BOOT_MIN_MS)),
  ])
}

export type BootPhase = 'loading' | 'leaving' | 'ready'

/**
 * Drives the first-load splash. Lives in `App`, which mounts once, so the
 * splash shows when someone arrives on the site and never again as they move
 * between screens.
 */
export function useAppBoot(): BootPhase {
  const [phase, setPhase] = useState<BootPhase>('loading')

  useEffect(() => {
    let cancelled = false
    let fadeTimer: number | undefined

    bootstrap().then(() => {
      if (cancelled) return
      setPhase('leaving')
      fadeTimer = window.setTimeout(() => {
        if (!cancelled) setPhase('ready')
      }, BOOT_FADE_MS)
    })

    return () => {
      cancelled = true
      window.clearTimeout(fadeTimer)
    }
  }, [])

  return phase
}
