import { AuthContext } from '@/contexts'
import { checkUserExists } from '@/services/auth'
import { UID } from '@/utils'
import { useEffect, useState } from 'react'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const verify = async () => {
      const stored = localStorage.getItem(UID)

      if (!stored) {
        setLoggedIn(false)
        setLoading(false)
        return
      }

      const ok = await checkUserExists(stored)

      if (ok) {
        setUid(stored)
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }

      setLoading(false)
    }

    verify()
  }, [])

  return (
    <AuthContext.Provider value={{ uid, loading, loggedIn, setUid }}>
      {children}
    </AuthContext.Provider>
  )
}
