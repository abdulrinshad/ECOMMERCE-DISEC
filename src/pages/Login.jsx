import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas/authSchemas'
import { useAuth } from '../context/AuthContext'
import SocialAuthButtons from '../components/auth/SocialAuthButtons'
import Button from '../components/ui/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import gsap from 'gsap'

export const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const revealRef = useScrollReveal()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Target redirect path
  const from = location.state?.from?.pathname || '/dashboard'

  // Refs for fields to trigger GSAP shake animation on error
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    trigger
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur'
  })

  // Trigger shake animation if errors occur
  useEffect(() => {
    if (errors.email && touchedFields.email) {
      gsap.to(emailRef.current, { x: [-6, 6, -4, 4, 0], duration: 0.3 })
    }
  }, [errors.email])

  useEffect(() => {
    if (errors.password && touchedFields.password) {
      gsap.to(passwordRef.current, { x: [-6, 6, -4, 4, 0], duration: 0.3 })
    }
  }, [errors.password])

  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      const userData = await login(data.email, data.password)

      toast.success('ACCESS INITIALIZED')

      const role = userData?.user?.role

      console.log('LOGIN RESPONSE:', userData)
      console.log('ROLE:', role)

      const searchParams = new URLSearchParams(location.search)
      const redirectQuery = searchParams.get('redirect')

      const redirectPath =
        redirectQuery
          ? redirectQuery
          : role === 'admin'
          ? '/admin'
          : from

      const mainEl = document.querySelector('main')

      if (mainEl) {
        gsap.to(mainEl, {
          backgroundColor: '#1A3C2E',
          duration: 0.3,
          onComplete: () => {
            navigate(redirectPath, { replace: true })
          }
        })
      } else {
        navigate(redirectPath, { replace: true })
      }

    } catch (err) {
      toast.error(err.message || 'Access Denied')

      const formEl = document.querySelector('form')

      if (formEl) {
        gsap.to(formEl, {
          x: [-10, 10, -8, 8, -5, 5, 0],
          duration: 0.4
        })
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
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
          alt="Login Editorial visual"
          className="w-full h-full object-cover object-center brightness-75 select-none"
        />
        <div className="absolute bottom-10 left-10 text-white z-10 space-y-2">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-none">
            AVANT-GARDE
          </h2>
          <p className="font-body text-[10px] uppercase tracking-widest text-[#E8E4DC]/80 font-medium">
            ARCHIVAL FASHION FOR THE MODERN ICONOCLAST
          </p>
        </div>
      </div>

      {/* Right Column: 50% width cream container */}
      <div
        ref={revealRef}
        className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 min-h-[60vh] md:min-h-screen"
      >
        <div className="w-full max-w-md space-y-10">
          <div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
              ACCESS ACCOUNT
            </h1>
            <p className="font-body text-[10px] font-medium uppercase tracking-widest text-[#5C5C5C] mt-2">
              CHOOSE YOUR PATH OR ENTER CREDENTIALS
            </p>
          </div>

          {/* Social Sign-In buttons */}
          <SocialAuthButtons dividerText="OR CONTINUE WITH EMAIL" />

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            {/* Email Field */}
            <div ref={emailRef} className="space-y-2">
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
                className={`w-full bg-transparent border-b py-2 text-xs font-body tracking-wider placeholder-[#5C5C5C]/40 focus:outline-none uppercase text-[#0A0A0A] transition-colors duration-250 ${errors.email && touchedFields.email
                    ? 'border-[#C8102E] focus:border-[#C8102E]'
                    : 'border-[#D8D3CA] focus:border-[#1A3C2E]'
                  }`}
                placeholder="ENTER EMAIL ADDRESS"
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

            {/* Password Field */}
            <div ref={passwordRef} className="space-y-2">
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
                  autoComplete="current-password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                  className={`w-full bg-transparent border-b py-2 pr-10 text-xs font-body tracking-wider placeholder-[#5C5C5C]/40 focus:outline-none focus:border-[#1A3C2E] text-[#0A0A0A] transition-colors duration-250 ${errors.password && touchedFields.password
                      ? 'border-[#C8102E] focus:border-[#C8102E]'
                      : 'border-[#D8D3CA] focus:border-[#1A3C2E]'
                    }`}
                  placeholder="ENTER PASSWORD"
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
              {errors.password && touchedFields.password && (
                <p
                  id="password-error"
                  className="font-body text-[12px] font-normal text-[#C8102E] tracking-wider uppercase mt-1"
                >
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] hover:text-[#1A3C2E] transition-colors"
                >
                  FORGOT PASSWORD?
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              <Button
                type="submit"
                variant="solid"
                disabled={!isValid || isSubmitting}
                aria-busy={isSubmitting ? 'true' : 'false'}
                className="w-full py-4 tracking-widest text-xs rounded-none uppercase font-semibold text-center flex items-center justify-center gap-2"
                style={{ borderRadius: 0 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1">
                    INITIALIZING
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                  </span>
                ) : (
                  'INITIALIZE ACCESS'
                )}
              </Button>

              <Link to="/register" className="block w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-4 tracking-widest text-xs rounded-none uppercase font-semibold text-center"
                  style={{ borderRadius: 0 }}
                >
                  CREATE ARCHIVE ACCOUNT
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login
