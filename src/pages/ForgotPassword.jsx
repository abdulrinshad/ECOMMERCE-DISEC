import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema } from '../schemas/authSchemas'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { toast } from 'react-hot-toast'
import gsap from 'gsap'

export const ForgotPassword = () => {
  const navigate = useNavigate()
  const revealRef = useScrollReveal()
  const { forgotPassword } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Ref for field shake animation on validation error
  const emailFieldRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur'
  })

  // Trigger shake animation when email validation error occurs on blur
  useEffect(() => {
    if (errors.email && touchedFields.email) {
      gsap.to(emailFieldRef.current, { x: [-6, 6, -4, 4, 0], duration: 0.3 })
    }
  }, [errors.email])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await forgotPassword(data.email)
      toast.success('Reset authorization code sent')
      
      // Navigate to OTP verification page, passing the email in state
      navigate('/verify-reset-otp', {
        state: { email: data.email }
      })
    } catch (err) {
      toast.error(err.message || 'Unable to process request')
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
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
          alt="Forgot Password Editorial visual"
          className="w-full h-full object-cover object-center brightness-75 select-none"
        />
        <div className="absolute bottom-10 left-10 text-white z-10 space-y-2">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-none animate-fade-up">
            AVANT-GARDE
          </h2>
          <p className="font-body text-[10px] uppercase tracking-widest text-[#E8E4DC]/80 font-medium animate-fade-up delay-150">
            RECOVER ACCESS. SECURITY INTEGRITY ESTABLISHED.
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
              RECOVER ACCESS
            </h1>
            <p className="font-body text-[10px] font-medium uppercase tracking-widest text-[#5C5C5C] mt-2">
              ENTER YOUR EMAIL IDENTITY TO RECEIVE A RESET CODE
            </p>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6" 
            noValidate
          >
            {/* Email Identity */}
            <div ref={emailFieldRef} className="space-y-1">
              <label 
                htmlFor="email" 
                className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block"
              >
                EMAIL IDENTITY
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
                className={`w-full bg-transparent border-b py-2 text-xs font-body tracking-wider placeholder-[#5C5C5C]/40 focus:outline-none uppercase text-[#0A0A0A] transition-colors duration-250 ${
                  errors.email && touchedFields.email
                    ? 'border-[#C8102E] focus:border-[#C8102E]'
                    : 'border-[#D8D3CA] focus:border-[#1A3C2E]'
                }`}
                placeholder="USER@DOMAIN.COM"
              />
              {errors.email && touchedFields.email && (
                <p 
                  id="email-error" 
                  className="font-body text-[12px] font-normal text-[#C8102E] tracking-wider uppercase mt-1"
                >
                  {errors.email.message}
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
                    SENDING CODE
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                  </span>
                ) : (
                  'SEND VERIFICATION CODE'
                )}
              </Button>
            </div>
          </form>

          {/* Bottom link */}
          <div className="text-center font-body text-[10px] font-semibold uppercase tracking-widest text-[#0A0A0A] select-none">
            ALREADY HAVE ACCESS?{' '}
            <Link to="/login" className="text-[#1A3C2E] hover:underline font-bold">
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ForgotPassword
