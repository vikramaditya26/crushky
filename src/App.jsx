import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import MatchReveal from './pages/MatchReveal'
import MatchProfile from './pages/MatchProfile'
import Companion from './pages/Companion'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/match" element={<MatchReveal />} />
      <Route path="/match/:id" element={<MatchProfile />} />
      <Route path="/companion" element={<Companion />} />
    </Routes>
  )
}
