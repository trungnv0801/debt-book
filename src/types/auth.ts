export interface AuthContextType {
  uid: string | null
  email: string | null
  loading: boolean
  loggedIn: boolean
  setUid: (uid: string | null) => void
}
