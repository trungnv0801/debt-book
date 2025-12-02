import { useState } from 'react'
import { loginUser } from '@/services/auth'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await loginUser(email, password)
      return data
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message ?? "Unknown error");
        throw err;
      }
    } finally {
      setLoading(false)

    }
  }

  return { login, loading, error }
}
