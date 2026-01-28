import { useEffect, useState } from 'react'
import { AuthContext } from '@/contexts'
import { listenAuthState, checkUserExists } from '@/services/auth'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = listenAuthState(async (user) => {
      if (!user) {
        setUid(null)
        setLoading(false)
        return
      }

      try {
        const ok = await checkUserExists(user.uid)
        if (ok) {
          setEmail(user.email)
          setUid(user.uid)
        }
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
        email,
        loading,
        loggedIn: !!uid,
        setUid,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
