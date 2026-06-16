import React from 'react'
import PropTypes from 'prop-types'

export const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (val) => {
    if (!val) return { score: 0, text: '', color: '' }
    
    const hasMinLength = val.length >= 8
    const hasUpper = /[A-Z]/.test(val)
    const hasNumber = /[0-9]/.test(val)

    if (hasMinLength && hasUpper && hasNumber) {
      return { score: 3, text: 'STRONG', color: '#1A3C2E' }
    }
    if (hasMinLength && (hasUpper || hasNumber)) {
      return { score: 2, text: 'MEDIUM', color: '#D4A017' }
    }
    return { score: 1, text: 'WEAK', color: '#C8102E' }
  }

  const { score, text, color } = getStrength(password)

  return (
    <div className="space-y-2 mt-2 w-full select-none">
      <div className="flex justify-between items-center">
        <span className="font-body text-[8px] uppercase tracking-widest text-[#5C5C5C] font-semibold">
          SECURITY LEVEL
        </span>
        {text && (
          <span 
            className="font-body text-[8px] uppercase tracking-widest font-extrabold transition-all duration-300"
            style={{ color }}
          >
            {text}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 h-1 w-full bg-transparent">
        <div 
          className="h-full transition-all duration-300 ease-out" 
          style={{ 
            backgroundColor: score >= 1 ? color : '#D8D3CA',
          }}
        />
        <div 
          className="h-full transition-all duration-300 ease-out" 
          style={{ 
            backgroundColor: score >= 2 ? color : '#D8D3CA',
          }}
        />
        <div 
          className="h-full transition-all duration-300 ease-out" 
          style={{ 
            backgroundColor: score >= 3 ? color : '#D8D3CA',
          }}
        />
      </div>
    </div>
  )
}

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string
}

export default PasswordStrengthMeter
