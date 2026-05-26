import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Chat is now part of the Dashboard "Talk" tab
// This page just redirects there
export default function Chat() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/dashboard', { replace: true })
  }, [navigate])
  return null
}
