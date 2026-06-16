import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import ContactSection from '../components/checkout/ContactSection'
import DeliverySection from '../components/checkout/DeliverySection'
import ShippingMethod from '../components/checkout/ShippingMethod'
import PaymentSection from '../components/checkout/PaymentSection'
import OrderSummary from '../components/checkout/OrderSummary'
import gsap from 'gsap'

export const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, clearCart, getCartTotal } = useCartStore()

  // Form states
  const [email, setEmail] = useState('')
  const [keepUpdated, setKeepUpdated] = useState(false)
  const [deliveryData, setDeliveryData] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    postalCode: '',
    country: ''
  })
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: ''
  })

  // Promo Code States
  const [discountPercent, setDiscountPercent] = useState(0)
  const [promoCode, setPromoCode] = useState('')

  // Accordion state for mobile order summary
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false)

  // Button submission states
  const [buttonState, setButtonState] = useState('idle') // idle, processing, success
  const [dots, setDots] = useState('')

  // Refs for validation shakes
  const emailRef = useRef(null)
  const deliveryRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    address1: useRef(null),
    city: useRef(null),
    postalCode: useRef(null),
    country: useRef(null)
  }
  const paymentRefs = {
    cardNumber: useRef(null),
    expiry: useRef(null),
    cvv: useRef(null),
    cardName: useRef(null)
  }

  // Calculate fees
  const shippingFee = shippingMethod === 'express' ? 18.00 : 0.00
  const subtotal = getCartTotal()
  const discountAmount = subtotal * discountPercent
  const discountedSubtotal = subtotal - discountAmount
  const vat = discountedSubtotal * 0.20
  const total = discountedSubtotal + shippingFee + vat

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && buttonState !== 'success') {
      navigate('/shop')
    }
  }, [cartItems, navigate, buttonState])

  // GSAP Animations on Mount
  useEffect(() => {
    // 1. Heading word-by-word fade up
    const titleWords = document.querySelectorAll('.checkout-title-word')
    gsap.fromTo(titleWords, 
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    )

    // 2. Sections Reveal
    const sections = document.querySelectorAll('.checkout-section')
    gsap.fromTo(sections,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out', delay: 0.3 }
    )
  }, [])

  // Dot loading animation loop
  useEffect(() => {
    if (buttonState !== 'processing') return
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
    }, 400)
    return () => clearInterval(interval)
  }, [buttonState])

  const shakeElement = (el) => {
    if (!el) return
    gsap.to(el, {
      x: [-8, 8, -6, 6, -4, 4, 0],
      duration: 0.4,
      clearProps: 'x'
    })
  }

  const validateForm = () => {
    let isValid = true
    let firstInvalidRef = null

    // Helper to mark invalid
    const markInvalid = (ref) => {
      isValid = false
      if (ref?.current) {
        shakeElement(ref.current)
        if (!firstInvalidRef) firstInvalidRef = ref
      }
    }

    // Check email
    if (!email || !email.includes('@')) {
      markInvalid(emailRef)
    }

    // Check delivery required fields
    const reqDeliveryFields = ['firstName', 'lastName', 'address1', 'city', 'postalCode', 'country']
    reqDeliveryFields.forEach((field) => {
      if (!deliveryData[field]) {
        markInvalid(deliveryRefs[field])
      }
    })

    // Check payment required fields
    const reqPaymentFields = ['cardNumber', 'expiry', 'cvv', 'cardName']
    reqPaymentFields.forEach((field) => {
      if (!paymentData[field]) {
        markInvalid(paymentRefs[field])
      }
    })

    if (firstInvalidRef?.current) {
      firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    return isValid
  }

  const handleApplyPromo = (percent, code) => {
    setDiscountPercent(percent)
    setPromoCode(code)
  }

  const handleCompleteAcquisition = (e) => {
    if (e) e.preventDefault()
    
    if (buttonState !== 'idle') return

    // Run validations
    if (!validateForm()) {
      return
    }

    // Transition to Processing state
    setButtonState('processing')

    // Simulate Payment processing
    setTimeout(() => {
      setButtonState('success')
      
      // Success flash animation
      const submitBtn = document.querySelectorAll('.checkout-submit-btn')
      gsap.to(submitBtn, {
        backgroundColor: '#22c55e',
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setTimeout(() => {
            clearCart()
            navigate('/shop')
          }, 1200)
        }
      })
    }, 2500)
  }

  if (cartItems.length === 0 && buttonState !== 'success') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Entrance Section */}
        <div className="overflow-hidden mb-12">
          <h1 className="font-display text-5xl md:text-8xl font-extrabold uppercase tracking-tight text-[#0A0A0A] leading-none flex flex-wrap gap-x-4">
            <span className="checkout-title-word inline-block">CHECKOUT</span>
            <span className="checkout-title-word inline-block font-light text-[#5C5C5C]">PROTOCOL</span>
          </h1>
        </div>

        {/* 60% Left / 40% Right Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-start">
          
          {/* MOBILE ACCORDION - SUMMARY FIRST */}
          <div className="lg:hidden col-span-1 border-b border-[#D8D3CA] pb-4">
            <button
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              className="w-full bg-white p-4 border border-[#D8D3CA] flex items-center justify-between font-display text-xs font-bold uppercase tracking-wider text-[#0A0A0A]"
            >
              <span>YOUR ACQUISITION ({cartItems.length})</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-extrabold">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={`transform transition-transform duration-200 ${isSummaryExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>
            
            {isSummaryExpanded && (
              <div className="mt-2">
                <OrderSummary
                  shippingFee={shippingFee}
                  discountPercent={discountPercent}
                  onApplyPromo={handleApplyPromo}
                  promoCode={promoCode}
                />
              </div>
            )}
          </div>

          {/* LEFT PANEL: CHECKOUT FORM (60%) */}
          <form 
            onSubmit={handleCompleteAcquisition}
            className="lg:col-span-6 space-y-2"
          >
            <ContactSection
              email={email}
              setEmail={setEmail}
              keepUpdated={keepUpdated}
              setKeepUpdated={setKeepUpdated}
              emailRef={emailRef}
            />

            <DeliverySection
              formData={deliveryData}
              setFormData={setDeliveryData}
              fieldRefs={deliveryRefs}
            />

            <ShippingMethod
              selectedMethod={shippingMethod}
              setSelectedMethod={setShippingMethod}
            />

            <PaymentSection
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              fieldRefs={paymentRefs}
            />

            {/* Desktop CTA Button */}
            <button
              type="submit"
              disabled={buttonState !== 'idle'}
              className="checkout-submit-btn w-full bg-[#1A3C2E] hover:bg-[#2D6B4F] text-white py-5 font-display text-sm font-extrabold uppercase tracking-[0.12em] border-none active:scale-[0.98] transition-all duration-200 mt-8 hidden lg:block cursor-pointer"
            >
              {buttonState === 'idle' && 'COMPLETE ACQUISITION'}
              {buttonState === 'processing' && `PROCESSING${dots}`}
              {buttonState === 'success' && 'ORDER CONFIRMED ✓'}
            </button>
          </form>

          {/* RIGHT PANEL: ORDER SUMMARY (40%) */}
          <div className="hidden lg:block lg:col-span-4">
            <OrderSummary
              shippingFee={shippingFee}
              discountPercent={discountPercent}
              onApplyPromo={handleApplyPromo}
              promoCode={promoCode}
            />
          </div>

        </div>
      </div>

      {/* Fixed Mobile CTA Button Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#D8D3CA] p-4 lg:hidden">
        <button
          type="button"
          onClick={handleCompleteAcquisition}
          disabled={buttonState !== 'idle'}
          className="checkout-submit-btn w-full bg-[#1A3C2E] hover:bg-[#2D6B4F] text-white py-4 font-display text-xs font-bold uppercase tracking-[0.12em] text-center border-none active:scale-[0.98] transition-all duration-120 cursor-pointer"
        >
          {buttonState === 'idle' && `COMPLETE ACQUISITION — $${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          {buttonState === 'processing' && `PROCESSING${dots}`}
          {buttonState === 'success' && 'ORDER CONFIRMED ✓'}
        </button>
      </div>
    </div>
  )
}

export default Checkout
