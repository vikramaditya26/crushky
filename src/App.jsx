import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './pages/Landing'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import MatchProfile from './pages/MatchProfile'

// Routes cross-fade so the product feels like one continuous surface
export default function App() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/start" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/match/:id" element={<MatchProfile />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
