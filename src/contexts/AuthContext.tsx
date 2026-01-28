import { createContext } from 'react'
import { AuthContextType } from '@/types'

export const AuthContext = createContext<AuthContextType>({
  uid: null,
  email: null,
  loading: true,
  loggedIn: false,
  setUid: () => {},
})
