import { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import gsap from 'gsap'

export const PromoCode = ({ onApplyPromo, currentDiscount }) => {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('idle') // idle, valid, invalid
  const inputContainerRef = useRef(null)
  const underlineRef = useRef(null)

  const handleApply = (e) => {
    e.preventDefault()
    if (!code.trim()) return

    // Valid code is ARCHIVE10 (10% discount)
    if (code.trim().toUpperCase() === 'ARCHIVE10') {
      setStatus('valid')
      onApplyPromo(0.1, code.trim().toUpperCase()) // 10% discount
      
      // Animate sweep of green underline
      if (underlineRef.current) {
        gsap.fromTo(underlineRef.current, 
          { scaleX: 0 }, 
          { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }
        )
      }
    } else {
      setStatus('invalid')
      onApplyPromo(0, '') // reset discount
      
      // Shake animation
      if (inputContainerRef.current) {
        gsap.to(inputContainerRef.current, {
          x: [-8, 8, -6, 6, -4, 4, 0],
          duration: 0.4,
          clearProps: 'x'
        })
      }
    }
  }

  return (
    <div className="py-4">
      <form onSubmit={handleApply} className="flex flex-col space-y-2">
        <label className="font-body text-[10px] font-medium tracking-[0.12em] text-[#5C5C5C] uppercase">
          PROMO CODE
        </label>
        <div ref={inputContainerRef} className="relative flex items-center border-b border-[#D8D3CA] group">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
            placeholder="ARCHIVE ACCESS CODE"
            disabled={status === 'valid'}
            className="w-full bg-transparent py-3 text-xs font-body font-light text-[#0A0A0A] placeholder:text-[#5C5C5C]/50 placeholder:uppercase focus:outline-none"
          />
          
          {/* Animated underline */}
          <span 
            ref={underlineRef}
            className={`absolute bottom-0 left-0 w-full h-[1.5px] origin-left transition-transform duration-250 ease-out ${
              status === 'valid' 
                ? 'bg-green-600 scale-x-100' 
                : status === 'invalid' 
                ? 'bg-red-500 scale-x-100' 
                : 'bg-[#1A3C2E] scale-x-0 group-focus-within:scale-x-100'
            }`} 
          />

          {status !== 'valid' ? (
            <button
              type="submit"
              className="text-[11px] font-body font-bold text-[#1A3C2E] uppercase hover:text-[#2D6B4F] transition-colors ml-2 flex-shrink-0"
            >
              APPLY &rarr;
            </button>
          ) : (
            <span className="text-[11px] font-body font-bold text-green-600 uppercase ml-2 flex-shrink-0 flex items-center space-x-1">
              <span>&#10003;</span>
              <span>ACCEPTED</span>
            </span>
          )}
        </div>
        
        {status === 'invalid' && (
          <span className="text-[9px] font-body text-red-500 uppercase tracking-wider">
            INVALID ARCHIVE CODE
          </span>
        )}
      </form>
    </div>
  )
}

PromoCode.propTypes = {
  onApplyPromo: PropTypes.func.isRequired,
  currentDiscount: PropTypes.number.isRequired
}

export default PromoCode
