import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, logoutUser } from '@/services/auth'
import { UID } from '@/utils'
import { AuthContext } from '@/contexts/AuthContext'

export const useAuth = () => {
  const { setUid } = useAuthContext()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await loginUser(email, password)

      localStorage.setItem(UID, data.uid)
      setUid(data.uid)

      return data
    } catch (err: any) {
      setError(err.message ?? 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)

      await logoutUser()

      localStorage.removeItem(UID)
      setUid(null)
      navigate('/login')
    } catch (err: any) {
      setError(err.message ?? '')
    } finally {
      setLoading(false)
    }
  }

  return { login, logout, loading, error }
}

export const useAuthContext = () => useContext(AuthContext)
