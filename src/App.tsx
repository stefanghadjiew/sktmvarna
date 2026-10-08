import { Navigate, Route, Routes } from 'react-router'

import { SplashScreen } from '@/components/splash-screen'
import { useAppBoot } from '@/hooks/use-app-boot'
import { Club } from '@/pages/club'
import { Gallery } from '@/pages/gallery'
import { Hall } from '@/pages/hall'
import { Home } from '@/pages/home'
import { MyBookings } from '@/pages/my-bookings'
import { NotFound } from '@/pages/not-found'
import { Prices } from '@/pages/prices'
import { Reserve } from '@/pages/reserve'
import { TournamentDetail } from '@/pages/tournament-detail'
import { Tournaments } from '@/pages/tournaments'
import { Trainers } from '@/pages/trainers'
// Profile and rankings are switched off for now. The pages themselves are kept
// intact — turning them back on is uncommenting these two imports and the two
// routes below, plus their entries in `src/data/nav.ts`.
// import { PlayerProfilePage } from '@/pages/player-profile'
// import { Rankings } from '@/pages/rankings'

/**
 * Every indexable route here also needs an entry in `src/seo/pages.ts`, which
 * drives the sitemap and the per-page HTML the build writes.
 */
function App() {
  const phase = useAppBoot()

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/reserve/my" element={<MyBookings />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:id" element={<TournamentDetail />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/hall" element={<Hall />} />
        <Route path="/club" element={<Club />} />
        <Route path="/gallery" element={<Gallery />} />
        {/* The old design preview and its pages now live at the routes above. */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/contacts" element={<Navigate to="/hall" replace />} />
        {/* <Route path="/account" element={<PlayerProfilePage />} /> */}
        {/* <Route path="/rankings" element={<Rankings />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Overlaid rather than rendered instead of the app, so the screen
          underneath is painted and its images are already loading by the time
          the splash fades. */}
      {phase !== 'ready' ? <SplashScreen leaving={phase === 'leaving'} /> : null}
    </>
  )
}

export default App
