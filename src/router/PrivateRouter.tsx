import React from 'react'
import { ACCESS_TOKEN } from '@/utils/constants'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRouter: React.FC = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  return accessToken ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRouter
