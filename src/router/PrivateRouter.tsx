import { JSX } from 'react'
import { Navigate } from 'react-router-dom'
import Loading from '@/components/common/Loading'
import { useAuthContext } from '@/hooks/auth'

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { loading, loggedIn } = useAuthContext()
  if (loading) return <Loading />

  if (!loggedIn) return <Navigate to="/login" replace />

  return children
}

export default PrivateRoute
