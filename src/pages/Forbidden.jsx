import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Forbidden = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const handleBackNavigation = () => {
    if (!isAuthenticated) {
      navigate('/login')
    } else if (user?.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9] text-[#0A0A0A] flex flex-col items-center justify-center px-6 py-12 select-none">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        {/* Visual Luxury Accent */}
        <div className="flex justify-center">
          <div className="w-16 h-[1px] bg-[#0A0A0A]/40 mb-2"></div>
        </div>

        <h1 className="font-display text-7xl md:text-9xl font-extrabold tracking-tighter leading-none text-[#0A0A0A]">
          403
        </h1>
        
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold uppercase tracking-[0.2em] text-[#0A0A0A]">
            Access Denied
          </h2>
          <p className="font-body text-xs text-[#5C5C5C] tracking-wide uppercase leading-relaxed max-w-xs mx-auto">
            You do not have permission to access this area.
          </p>
        </div>

        {/* Visual Divider */}
        <div className="flex justify-center py-4">
          <div className="w-8 h-[1px] bg-[#0A0A0A]/20"></div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            onClick={handleBackNavigation}
            className="inline-block px-8 py-3.5 bg-[#0A0A0A] text-white hover:bg-[#2D6B4F] transition-all duration-300 font-body text-[10px] font-semibold uppercase tracking-[0.15em] active:scale-[0.98]"
          >
            {isAuthenticated 
              ? (user?.role === 'admin' ? 'Go to Admin Console' : 'Go to My Account') 
              : 'Return to Login'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default Forbidden
