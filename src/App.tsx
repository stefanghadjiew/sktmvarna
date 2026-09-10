import { Route, Routes } from 'react-router'

import { Gallery } from '@/pages/gallery'
import { Home } from '@/pages/home'
import { NotFound } from '@/pages/not-found'
import { PlayerProfilePage } from '@/pages/player-profile'
import { Rankings } from '@/pages/rankings'
import { Trainers } from '@/pages/trainers'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/account" element={<PlayerProfilePage />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/rankings" element={<Rankings />} />
      <Route path="/trainers" element={<Trainers />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
