export interface AuthContextType {
  uid: string | null
  loading: boolean
  loggedIn: boolean
  setUid: (uid: string | null) => void
}
