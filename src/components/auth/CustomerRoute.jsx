import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingScreen from '../ui/LoadingScreen'

export const CustomerRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Prevent role crossover: Admins cannot access customer pages (dashboard, checkout, orders, etc.)
  if (user?.role === 'admin') {
    return <Navigate to="/forbidden" replace />
  }

  return <Outlet />
}

export default CustomerRoute
