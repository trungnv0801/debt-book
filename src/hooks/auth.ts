import { useContext, useState } from 'react'
import { loginUser } from '@/services/auth'
import { UID } from '@/utils'
import { AuthContext } from '@/contexts/AuthContext'

export const useAuth = () => {
  const { setUid } = useAuthContext()
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

  return { login, loading, error }
}

export const useAuthContext = () => useContext(AuthContext)
