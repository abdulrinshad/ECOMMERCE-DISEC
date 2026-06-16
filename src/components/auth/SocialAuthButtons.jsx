import React from 'react'
import PropTypes from 'prop-types'

export const SocialAuthButtons = ({ dividerText = 'OR CONTINUE WITH EMAIL' }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => alert('Apple Authentication Protocol Initialized')}
          className="py-3.5 border border-[#D8D3CA] hover:border-[#1A3C2E] hover:bg-white transition-all duration-150 font-body text-[10px] font-medium uppercase tracking-widest text-[#0A0A0A] focus:outline-none"
        >
          APPLE ID
        </button>
        <button
          type="button"
          onClick={() => alert('Google Authentication Protocol Initialized')}
          className="py-3.5 border border-[#D8D3CA] hover:border-[#1A3C2E] hover:bg-white transition-all duration-150 font-body text-[10px] font-medium uppercase tracking-widest text-[#0A0A0A] focus:outline-none"
        >
          GOOGLE
        </button>
      </div>

      <div className="flex items-center gap-4 select-none">
        <span className="h-[1px] bg-[#D8D3CA] flex-1"></span>
        <span className="font-body text-[9px] uppercase tracking-widest text-[#5C5C5C] font-semibold">
          {dividerText}
        </span>
        <span className="h-[1px] bg-[#D8D3CA] flex-1"></span>
      </div>
    </div>
  )
}

SocialAuthButtons.propTypes = {
  dividerText: PropTypes.string
}

export default SocialAuthButtons
