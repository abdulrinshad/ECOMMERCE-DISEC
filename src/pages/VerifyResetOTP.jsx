import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { toast } from 'react-hot-toast'
import gsap from 'gsap'

export const VerifyResetOTP = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const revealRef = useScrollReveal()
  const { verifyResetOTP, forgotPassword } = useAuth()

  const email = location.state?.email

  // If email does not exist, redirect to /forgot-password
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  // Refs for inputs and form shaking
  const inputRefs = useRef([])
  const containerRef = useRef(null)

  // Auto-focus first input on mount
  useEffect(() => {
    if (email && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [email])

  // Timer countdown logic for resending code
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  if (!email) return null

  const handleChange = (index, value) => {
    // Only allow numeric input
    if (value && !/^[0-9]$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setErrorMessage('') // Clear errors as user types

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Focus previous input and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1].focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
      setErrorMessage('')
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    // Extract first 6 digits
    const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 6).split('')
    if (digits.length === 0) return

    const newOtp = [...otp]
    digits.forEach((digit, idx) => {
      newOtp[idx] = digit
    })
    setOtp(newOtp)
    setErrorMessage('')

    // Focus last filled input or the last box
    const focusIndex = Math.min(digits.length - 1, 5)
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus()
    }
  }

  const isOtpComplete = otp.every((val) => val !== '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isOtpComplete || isVerifying) return

    setIsVerifying(true)
    setErrorMessage('')
    const otpValue = otp.join('')

    try {
      await verifyResetOTP(email, otpValue)
      toast.success('Identity verified')

      // Navigate to reset password page, passing email and verification code
      navigate('/reset-password', {
        state: { email, otp: otpValue }
      })
    } catch (err) {
      const msg = err.message || 'Verification failed'
      setErrorMessage(msg)
      toast.error(msg)

      // Shake animation for the OTP container
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          x: [-10, 10, -8, 8, -5, 5, 0],
          duration: 0.4
        })
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (isResending || countdown > 0) return

    setIsResending(true)
    setErrorMessage('')
    try {
      // Re-trigger forgotPassword to send a new code
      await forgotPassword(email)
      toast.success('New verification code sent')
      setCountdown(60)
    } catch (err) {
      const msg = err.message || 'Failed to resend code'
      setErrorMessage(msg)
      toast.error(msg)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <main className="w-full min-h-screen flex flex-col md:flex-row bg-[#F2EFE9] transition-colors duration-300">
      {/* Left Column: 50% width bleed editorial photo */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-screen relative overflow-hidden bg-bg-dark border-b md:border-b-0 md:border-r border-[#D8D3CA]">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
          alt="Verify OTP Editorial visual"
          className="w-full h-full object-cover object-center brightness-75 select-none"
        />
        <div className="absolute bottom-10 left-10 text-white z-10 space-y-2">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-none animate-fade-up">
            AVANT-GARDE
          </h2>
          <p className="font-body text-[10px] uppercase tracking-widest text-[#E8E4DC]/80 font-medium animate-fade-up delay-150">
            AUTHENTICATE TRANSACTION. SECURE HANDSHAKE PENDING.
          </p>
        </div>
      </div>

      {/* Right Column: 50% width cream container */}
      <div
        ref={revealRef}
        className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 min-h-[60vh] md:min-h-screen"
      >
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
              VERIFY RESET CODE
            </h1>
            <p className="font-body text-[10px] font-medium uppercase tracking-widest text-[#5C5C5C] mt-2">
              CODE SENT TO <span className="text-[#0A0A0A] font-bold">{email.toUpperCase()}</span>
            </p>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSubmit} 
            className="space-y-8" 
            noValidate
          >
            {/* OTP Container */}
            <div ref={containerRef} className="space-y-2">
              <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
                RESET PASSWORD PIN
              </label>
              
              <div 
                className="flex justify-between gap-2 md:gap-4" 
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    aria-label={`Digit ${index + 1} of 6`}
                    className="w-10 md:w-12 h-12 text-center text-lg font-body border-b bg-transparent focus:outline-none focus:border-[#1A3C2E] border-[#D8D3CA] text-[#0A0A0A] transition-colors duration-250 uppercase"
                  />
                ))}
              </div>

              {errorMessage && (
                <p className="font-body text-[12px] font-normal text-[#C8102E] tracking-wider uppercase mt-3 block text-center">
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="space-y-6 pt-2">
              <Button
                type="submit"
                variant="solid"
                disabled={!isOtpComplete || isVerifying}
                aria-busy={isVerifying ? 'true' : 'false'}
                className="w-full py-4 tracking-widest text-xs font-semibold text-center flex items-center justify-center gap-2 transition-opacity duration-200"
                style={{
                  borderRadius: 0,
                  opacity: isOtpComplete ? 1 : 0.5,
                  cursor: isOtpComplete ? 'pointer' : 'not-allowed'
                }}
              >
                {isVerifying ? (
                  <span className="flex items-center gap-1">
                    VERIFYING
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                  </span>
                ) : (
                  'VERIFY RESET CODE'
                )}
              </Button>
            </div>
          </form>

          {/* Resend Action */}
          <div className="text-center font-body space-y-2 pt-2">
            <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
              DIDN'T RECEIVE A CODE?
            </span>
            {countdown > 0 ? (
              <span className="font-body text-[10px] font-bold uppercase tracking-widest text-[#5C5C5C] block">
                RESEND AVAILABLE IN {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-[#1A3C2E] hover:underline font-bold font-body text-[10px] tracking-widest uppercase focus:outline-none transition-colors duration-200"
              >
                {isResending ? 'SENDING...' : 'RESEND VERIFICATION CODE'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default VerifyResetOTP
