import { Route, Routes } from 'react-router'

import { SplashScreen } from '@/components/splash-screen'
import { useAppBoot } from '@/hooks/use-app-boot'
import { Gallery } from '@/pages/gallery'
import { Home } from '@/pages/home'
import { NotFound } from '@/pages/not-found'
import { PlayerProfilePage } from '@/pages/player-profile'
import { Rankings } from '@/pages/rankings'
import { Trainers } from '@/pages/trainers'

function App() {
  const phase = useAppBoot()

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<PlayerProfilePage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/trainers" element={<Trainers />} />
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
