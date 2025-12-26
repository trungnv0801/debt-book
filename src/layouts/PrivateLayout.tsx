import { Navigate, Outlet } from 'react-router-dom'
import Loading from '@/components/common/Loading'
import { useAuthContext } from '@/hooks/auth'

const PrivateLayout = () => {
  const { loading, loggedIn } = useAuthContext()

  if (loading) return <Loading />

  if (!loggedIn) return <Navigate to="/login" replace />

  return <Outlet />
}

export default PrivateLayout
