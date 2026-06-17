import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema } from '../schemas/authSchemas'
import { useAuth } from '../context/AuthContext'
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter'
import Button from '../components/ui/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import gsap from 'gsap'

export const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const revealRef = useScrollReveal()
  const { resetPassword } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCheckmark, setShowCheckmark] = useState(false)

  const email = location.state?.email
  const otp = location.state?.otp

  // If email or otp do not exist, redirect to /forgot-password
  useEffect(() => {
    if (!email || !otp) {
      navigate('/forgot-password')
    }
  }, [email, otp, navigate])

  // Field refs for GSAP shake animations
  const passFieldRef = useRef(null)
  const confirmPassFieldRef = useRef(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, isValid }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur'
  })

  const passwordVal = watch('password') || ''
  const confirmPasswordVal = watch('confirmPassword') || ''

  // Watch confirm password to display success checkmark
  useEffect(() => {
    if (
      confirmPasswordVal &&
      passwordVal &&
      confirmPasswordVal === passwordVal &&
      !errors.confirmPassword
    ) {
      setShowCheckmark(true)
    } else {
      setShowCheckmark(false)
    }
  }, [confirmPasswordVal, passwordVal, errors.confirmPassword])

  // Trigger individual field shakes when validation errors occur on blur
  useEffect(() => {
    if (errors.password && touchedFields.password) {
      gsap.to(passFieldRef.current, { x: [-6, 6, -4, 4, 0], duration: 0.3 })
    }
  }, [errors.password])

  useEffect(() => {
    if (errors.confirmPassword && touchedFields.confirmPassword) {
      gsap.to(confirmPassFieldRef.current, { x: [-6, 6, -4, 4, 0], duration: 0.3 })
    }
  }, [errors.confirmPassword])

  if (!email || !otp) return null

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await resetPassword(email, otp, data.password, data.confirmPassword)
      toast.success('Password updated')

      // Green flash and redirect animation
      const mainEl = document.querySelector('main')
      if (mainEl) {
        gsap.to(mainEl, {
          backgroundColor: '#2D6B4F',
          duration: 0.3,
          onComplete: () => {
            gsap.to(mainEl, {
              backgroundColor: '#1A3C2E',
              duration: 0.5,
              delay: 0.3,
              onComplete: () => {
                navigate('/login')
              }
            })
          }
        })
      } else {
        setTimeout(() => navigate('/login'), 800)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reset password')
      // Form level shake on server/unexpected error
      const formEl = document.querySelector('form')
      if (formEl) {
        gsap.to(formEl, { x: [-10, 10, -8, 8, 0], duration: 0.4 })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="w-full min-h-screen flex flex-col md:flex-row bg-[#F2EFE9] transition-colors duration-300">
      {/* Left Column: 50% width bleed editorial photo */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-screen relative overflow-hidden bg-bg-dark border-b md:border-b-0 md:border-r border-[#D8D3CA]">
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"
          alt="Reset Password Editorial visual"
          className="w-full h-full object-cover object-center brightness-75 select-none"
        />
        <div className="absolute bottom-10 left-10 text-white z-10 space-y-2">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-none animate-fade-up">
            AVANT-GARDE
          </h2>
          <p className="font-body text-[10px] uppercase tracking-widest text-[#E8E4DC]/80 font-medium animate-fade-up delay-150">
            ESTABLISH NEW CREDENTIALS. SYMMETRICAL KEYS SECURED.
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
              NEW CREDENTIALS
            </h1>
            <p className="font-body text-[10px] font-medium uppercase tracking-widest text-[#5C5C5C] mt-2">
              ESTABLISH YOUR NEW ARCHIVAL PASSCODE
            </p>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6" 
            noValidate
          >
            {/* New Secret Key */}
            <div ref={passFieldRef} className="space-y-1">
              <label 
                htmlFor="password" 
                className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block"
              >
                NEW SECRET KEY
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                  className={`w-full bg-transparent border-b py-2 pr-10 text-xs font-body tracking-wider placeholder-[#5C5C5C]/40 focus:outline-none focus:border-[#1A3C2E] text-[#0A0A0A] transition-colors duration-250 ${
                    errors.password && touchedFields.password
                      ? 'border-[#C8102E] focus:border-[#C8102E]'
                      : 'border-[#D8D3CA] focus:border-[#1A3C2E]'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-2 text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <PasswordStrengthMeter password={passwordVal} />
              {errors.password && touchedFields.password && (
                <p 
                  id="password-error" 
                  className="font-body text-[12px] font-normal text-[#C8102E] tracking-wider uppercase mt-1"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Secret Key */}
            <div ref={confirmPassFieldRef} className="space-y-1">
              <label 
                htmlFor="confirmPassword" 
                className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block"
              >
                CONFIRM NEW SECRET KEY
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  {...register('confirmPassword')}
                  className={`w-full bg-transparent border-b py-2 pr-10 text-xs font-body tracking-wider placeholder-[#5C5C5C]/40 focus:outline-none focus:border-[#1A3C2E] text-[#0A0A0A] transition-colors duration-250 ${
                    errors.confirmPassword && touchedFields.confirmPassword
                      ? 'border-[#C8102E] focus:border-[#C8102E]'
                      : 'border-[#D8D3CA] focus:border-[#1A3C2E]'
                  }`}
                  placeholder="••••••••"
                />
                {showCheckmark && (
                  <span 
                    className="absolute right-2 top-2 text-[#1A3C2E] animate-scale-pop"
                    style={{
                      animation: 'scalePop 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                    }}
                  >
                    <FiCheck size={18} />
                  </span>
                )}
              </div>
              {errors.confirmPassword && touchedFields.confirmPassword && (
                <p 
                  id="confirmPassword-error" 
                  className="font-body text-[12px] font-normal text-[#C8102E] tracking-wider uppercase mt-1"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                variant="solid"
                disabled={!isValid || isSubmitting}
                aria-busy={isSubmitting ? 'true' : 'false'}
                className="w-full py-4 tracking-widest text-xs font-semibold text-center flex items-center justify-center gap-2 transition-opacity duration-200"
                style={{
                  borderRadius: 0,
                  opacity: isValid ? 1 : 0.5,
                  cursor: isValid ? 'pointer' : 'not-allowed'
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1">
                    UPDATING CREDENTIALS
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                  </span>
                ) : (
                  'UPDATE PASSCODE'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default ResetPassword
