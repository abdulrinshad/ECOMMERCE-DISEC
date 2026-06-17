import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingScreen from '../ui/LoadingScreen'

export const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}

export default AdminRoute
