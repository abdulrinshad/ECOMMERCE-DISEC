import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../schemas/authSchemas'
import { useAuth } from '../context/AuthContext'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'
import PasswordStrengthMeter from '../components/auth/PasswordStrengthMeter'
import Button from '../components/ui/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import gsap from 'gsap'

export const Register = () => {
  const navigate = useNavigate()
  const revealRef = useScrollReveal()
  const { register: registerUser, checkEmailExists } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailTakenError, setEmailTakenError] = useState('')
  const [showCheckmark, setShowCheckmark] = useState(false)

  // Field refs for GSAP shake animations
  const nameFieldRef = useRef(null)
  const emailFieldRef = useRef(null)
  const passFieldRef = useRef(null)
  const confirmPassFieldRef = useRef(null)
  const termsFieldRef = useRef(null)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, touchedFields, isValid },
    getFieldState
  } = useForm({
    resolver: zodResolver(registerSchema),
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
    if (errors.fullName && touchedFields.fullName) {
      gsap.to(nameFieldRef.current, { x: [-6, 6, -4, 4, 0], duration: 0.3 })
    }
  }, [errors.fullName])

  useEffect(() => {
    if ((errors.email || emailTakenError) && touchedFields.email) {
      gsap.to(emailFieldRef.current, { x: [-6, 6, -4, 4, 0], duration: 0.3 })
    }
  }, [errors.email, emailTakenError])

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

  // Check email on blur
  const handleEmailBlur = async (e) => {
    const email = e.target.value
    if (!email || errors.email) return

    const taken = await checkEmailExists(email)
    if (taken) {
      setEmailTakenError('This identity is already registered')
      setError('email', { type: 'manual', message: 'This identity is already registered' })
    } else {
      setEmailTakenError('')
      clearErrors('email')
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Re-verify email availability right before submitting
      const taken = await checkEmailExists(data.email)
      if (taken) {
        setEmailTakenError('This identity is already registered')
        setError('email', { type: 'manual', message: 'This identity is already registered' })
        setIsSubmitting(false)
        return
      }

      await registerUser(data.fullName, data.email, data.password)
      toast.success(
  'Verification code sent to your email'
)

navigate('/verify-email', {
  state: {
    email: data.email
  }
})

    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Terms checkbox error shake on submit attempt
  const handleInvalidSubmit = (formErrors) => {
    if (formErrors.agreedToTerms) {
      gsap.to(termsFieldRef.current, { x: [-6, 6, -4, 4, 0], duration: 0.3 })
    }
  }

  const isFormValid = isValid && !emailTakenError

  return (
    <main className="w-full min-h-screen flex flex-col md:flex-row bg-[#F2EFE9] transition-colors duration-300">
      {/* Left Column: 50% width bleed editorial photo */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-screen relative overflow-hidden bg-bg-dark border-b md:border-b-0 md:border-r border-[#D8D3CA]">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
          alt="Register Editorial visual"
          className="w-full h-full object-cover object-center brightness-75 select-none"
        />
        <div className="absolute bottom-10 left-10 text-white z-10 space-y-2">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-none animate-fade-up">
            AVANT-GARDE
          </h2>
          <p className="font-body text-[10px] uppercase tracking-widest text-[#E8E4DC]/80 font-medium animate-fade-up delay-150">
            JOIN THE ARCHIVE. ACCESS IS EARNED.
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
              CREATE ACCOUNT
            </h1>
            <p className="font-body text-[10px] font-medium uppercase tracking-widest text-[#5C5C5C] mt-2">
              BEGIN YOUR ARCHIVAL MEMBERSHIP
            </p>
          </div>

          {/* Social signup buttons */}
          <SocialAuthButtons dividerText="OR REGISTER WITH EMAIL" />

          {/* Form */}
          <form 
            onSubmit={handleSubmit(onSubmit, handleInvalidSubmit)} 
            className="space-y-6" 
            noValidate
          >
            {/* Full Name */}
            <div ref={nameFieldRef} className="space-y-1">
              <label 
                htmlFor="fullName" 
                className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block"
              >
                FULL NAME
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                {...register('fullName')}
                className={`w-full bg-transparent border-b py-2 text-xs font-body tracking-wider placeholder-[#5C5C5C]/40 focus:outline-none uppercase text-[#0A0A0A] transition-colors duration-250 ${
                  errors.fullName && touchedFields.fullName
                    ? 'border-[#C8102E] focus:border-[#C8102E]'
                    : 'border-[#D8D3CA] focus:border-[#1A3C2E]'
                }`}
                placeholder="ENTER YOUR NAME"
              />
              {errors.fullName && touchedFields.fullName && (
                <p 
                  id="fullName-error" 
                  className="font-body text-[12px] font-normal text-[#C8102E] tracking-wider uppercase mt-1"
                >
                  {errors.fullName.message}
                </p>
              )}
            </div>

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
                aria-invalid={errors.email || emailTakenError ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email', {
                  onBlur: handleEmailBlur
                })}
                className={`w-full bg-transparent border-b py-2 text-xs font-body tracking-wider placeholder-[#5C5C5C]/40 focus:outline-none uppercase text-[#0A0A0A] transition-colors duration-250 ${
                  (errors.email || emailTakenError) && touchedFields.email
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

            {/* Secret Key */}
            <div ref={passFieldRef} className="space-y-1">
              <label 
                htmlFor="password" 
                className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block"
              >
                SECRET KEY
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
                CONFIRM SECRET KEY
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

            {/* Terms Checkbox */}
            <div ref={termsFieldRef} className="space-y-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  aria-invalid={errors.agreedToTerms ? 'true' : 'false'}
                  aria-describedby={errors.agreedToTerms ? 'agreedToTerms-error' : undefined}
                  {...register('agreedToTerms')}
                  className="rounded-none border-[#D8D3CA] text-[#1A3C2E] focus:ring-[#1A3C2E] h-4 w-4 bg-transparent cursor-pointer"
                />
                <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#0A0A0A]">
                  I AGREE TO THE{' '}
                  <a href="#terms" onClick={(e) => { e.preventDefault(); alert('PROTOCOL TERMS') }} className="text-[#1A3C2E] hover:underline">PROTOCOL</a>
                  {' '}&{' '}
                  <a href="#security" onClick={(e) => { e.preventDefault(); alert('SECURITY TERMS') }} className="text-[#1A3C2E] hover:underline">SECURITY TERMS</a>
                </span>
              </label>
              {errors.agreedToTerms && (
                <p 
                  id="agreedToTerms-error" 
                  className="font-body text-[12px] font-normal text-[#C8102E] tracking-wider uppercase mt-1 block"
                >
                  {errors.agreedToTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="space-y-4 pt-2">
              <Button
                type="submit"
                variant="solid"
                disabled={!isFormValid || isSubmitting}
                aria-busy={isSubmitting ? 'true' : 'false'}
                className="w-full py-4 tracking-widest text-xs font-semibold text-center flex items-center justify-center gap-2 transition-opacity duration-200"
                style={{
                  borderRadius: 0,
                  opacity: isFormValid ? 1 : 0.5,
                  cursor: isFormValid ? 'pointer' : 'not-allowed'
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1">
                    CREATING ACCOUNT
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                  </span>
                ) : (
                  'INITIALIZE MEMBERSHIP'
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

export default Register
