import { AuthContext } from '@/contexts'
import { checkUserExists } from '@/services/auth'
import { UID } from '@/utils'
import { useEffect, useState } from 'react'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      const stored = localStorage.getItem(UID)

      if (!stored) {
        setUid(null)
        setLoading(false)
        return
      }

      const ok = await checkUserExists(stored)

      setUid(ok ? stored : null)
      setLoading(false)
    }

    verify()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        uid,
        loading,
        loggedIn: !!uid,
        setUid,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
