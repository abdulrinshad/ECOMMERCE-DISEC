import React, { createContext, useContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useCartStore } from '../store/cartStore'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const checkAuth = async () => {
    try {
      // 1. Try to refresh token silently
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!refreshRes.ok) {
        dispatch({ type: 'AUTH_FAILURE' })
        return
      }

      const refreshData = await refreshRes.json()
      const { user, accessToken } = refreshData.data

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, accessToken }
      })
      useCartStore.getState().fetchCart(accessToken)
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' })
    }
  }

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const responseData = await res.json()
      if (!res.ok) {
        throw new Error(responseData.message || 'Login failed')
      }

      const { user, accessToken } = responseData.data
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, accessToken }
      })
      useCartStore.getState().fetchCart(accessToken)
      return responseData.data
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' })
      throw error;
    }
  }

  const register = async (fullName, email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      })

      const responseData = await res.json()
      if (!res.ok) {
        throw new Error(responseData.message || 'Registration failed')
      }

      dispatch({ type: 'SET_LOADING', payload: false })
      return responseData
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error;
    }
  }

  const verifyOTP = async (email, otp) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const responseData = await res.json()
      dispatch({ type: 'SET_LOADING', payload: false })
      if (!res.ok) {
        throw new Error(responseData.message || 'Verification failed')
      }
      return responseData
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const resendOTP = async (email) => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const responseData = await res.json()
      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to resend code')
      }
      return responseData
    } catch (error) {
      throw error
    }
  }

  const forgotPassword = async (email) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const responseData = await res.json()
      dispatch({ type: 'SET_LOADING', payload: false })
      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to request reset')
      }
      return responseData
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const verifyResetOTP = async (email, otp) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const responseData = await res.json()
      dispatch({ type: 'SET_LOADING', payload: false })
      if (!res.ok) {
        throw new Error(responseData.message || 'Verification failed')
      }
      return responseData
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const resetPassword = async (email, otp, password, confirmPassword) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password, confirmPassword })
      })
      const responseData = await res.json()
      dispatch({ type: 'SET_LOADING', payload: false })
      if (!res.ok) {
        throw new Error(responseData.message || 'Password reset failed')
      }
      return responseData
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
    } finally {
      dispatch({ type: 'AUTH_FAILURE' })
      useCartStore.getState().clearCart() // clears local store
    }
  }

  const checkEmailExists = async (email) => {
    try {
      const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`)
      const responseData = await res.json()
      return responseData.data?.exists || false
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, verifyOTP, resendOTP, logout, checkAuth, checkEmailExists, forgotPassword, verifyResetOTP, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
