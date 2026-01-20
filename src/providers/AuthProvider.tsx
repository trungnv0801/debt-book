import { useEffect, useState } from 'react'
import { AuthContext } from '@/contexts'
import { listenAuthState, checkUserExists } from "@/services/auth"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = listenAuthState(async (user) => {
      if (!user) {
        setUid(null)
        setLoading(false)
        return
      }

      try {
        const ok = await checkUserExists(user.uid)
        setUid(ok ? user.uid : null)
      } catch (err) {
        setUid(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
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
