import React from 'react'
import PropTypes from 'prop-types'
import { FiLock } from 'react-icons/fi'
import UnderlineInput from './UnderlineInput'

export const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
  paymentData,
  setPaymentData,
  fieldRefs
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({ ...prev, [name]: value }))
  }

  // Simple card format handler
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 16) value = value.slice(0, 16)
    // Add spaces
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value
    setPaymentData((prev) => ({ ...prev, cardNumber: formatted }))
  }

  // Expiry format handler (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 4) value = value.slice(0, 4)
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`
    }
    setPaymentData((prev) => ({ ...prev, expiry: value }))
  }

  // Security code limit
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setPaymentData((prev) => ({ ...prev, cvv: value }))
  }

  return (
    <div className="checkout-section pb-10 mb-10">
      <h3 className="font-body text-xs font-medium tracking-[0.12em] text-[#5C5C5C] uppercase mb-6">
        04 / PAYMENT CONFIGURATION
      </h3>

      {/* Payment Method Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          type="button"
          onClick={() => setPaymentMethod('CARD')}
          className={`py-4 px-6 border font-display text-[9px] font-extrabold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
            paymentMethod === 'CARD'
              ? 'bg-[#1A3C2E] border-[#1A3C2E] text-white'
              : 'bg-white border-[#D8D3CA] text-[#5C5C5C] hover:border-[#1A3C2E] hover:text-[#0A0A0A]'
          }`}
        >
          CREDIT / DEBIT CARD
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('COD')}
          className={`py-4 px-6 border font-display text-[9px] font-extrabold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
            paymentMethod === 'COD'
              ? 'bg-[#1A3C2E] border-[#1A3C2E] text-white'
              : 'bg-white border-[#D8D3CA] text-[#5C5C5C] hover:border-[#1A3C2E] hover:text-[#0A0A0A]'
          }`}
        >
          CASH ON DELIVERY (COD)
        </button>
      </div>

      {paymentMethod === 'COD' ? (
        <div className="p-6 border border-[#D8D3CA] bg-white/40 space-y-2 select-none">
          <p className="font-display text-[10px] font-extrabold uppercase tracking-widest text-[#1A3C2E]">
            COD Protocol Initialized
          </p>
          <p className="font-body text-xs text-[#5C5C5C] uppercase leading-relaxed">
            Please prepare your cash equivalent upon courier arrival. Your security code validation will occur during physical drop-off.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card Number */}
          <div ref={fieldRefs.cardNumber}>
            <UnderlineInput
              label="CARD NUMBER"
              placeholder="0000 0000 0000 0000"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={handleCardNumberChange}
              required
            />
          </div>

          {/* 2-column: Expiry and CVV */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={fieldRefs.expiry}>
              <UnderlineInput
                label="EXPIRY DATE"
                placeholder="MM/YY"
                name="expiry"
                value={paymentData.expiry}
                onChange={handleExpiryChange}
                required
              />
            </div>
            <div ref={fieldRefs.cvv}>
              <UnderlineInput
                label="SECURITY CODE"
                placeholder="CVC/CVV"
                name="cvv"
                value={paymentData.cvv}
                onChange={handleCvvChange}
                required
              />
            </div>
          </div>

          {/* Name on Card */}
          <div ref={fieldRefs.cardName}>
            <UnderlineInput
              label="NAME ON CARD"
              placeholder="NAME ON CARD"
              name="cardName"
              value={paymentData.cardName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Payment Icons and Encryption Details */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 gap-4">
            <div className="flex items-center text-[#5C5C5C] space-x-2">
              <FiLock size={14} className="text-[#5C5C5C] flex-shrink-0" />
              <span className="font-body text-[10px] tracking-[0.08em] uppercase text-[#5C5C5C]">
                256-BIT SSL ENCRYPTED CONNECTION
              </span>
            </div>

            <div className="flex items-center space-x-3 text-[#5C5C5C]">
              {/* Visa SVG */}
              <svg className="h-5 w-auto fill-current opacity-60" viewBox="0 0 24 15" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.8 14.2l1.6-9.8H14l-1.6 9.8H9.8zm7.3-9.5c-.3-.8-1-1.3-2-1.3h-3.4c-.2 0-.4.1-.5.3l-3.8 9H9.2l.6-3.8h2.9l.3-1.8H9.9l.6-3.7c0-.2.2-.4.4-.4h2.1l1.7 7.7h2.2l1.2-7.7zM3.4 4.4L1 6.1v8.1h2.2V9.3h.9c1.6 0 2.8-.7 3.2-2.3L8 4.4H3.4zm1.9 2.5c-.2.7-.8 1-1.6 1h-.3V5.5h.3c.8 0 1.4.3 1.6 1.4z" />
              </svg>
              {/* Mastercard SVG */}
              <svg className="h-5 w-auto fill-current opacity-60" viewBox="0 0 24 15" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7.5" cy="7.5" r="7.5" />
                <circle cx="16.5" cy="7.5" r="7.5" />
              </svg>
              {/* Amex SVG */}
              <svg className="h-5 w-auto fill-current opacity-60" viewBox="0 0 24 15" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1h22v13H1V1zm2 2v9h18V3H3zm2 1.5h1.5l1.5 2.5 1.5-2.5H11v6H9.5V6L8 8.5h-1L5.5 6v3.5H4v-6zm9 0h3v1.5h-1.5V6H17v1.5h-1.5v1.5H17V9h-3V4.5z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

PaymentSection.propTypes = {
  paymentMethod: PropTypes.string.isRequired,
  setPaymentMethod: PropTypes.func.isRequired,
  paymentData: PropTypes.object.isRequired,
  setPaymentData: PropTypes.func.isRequired,
  fieldRefs: PropTypes.object.isRequired
}

export default PaymentSection
