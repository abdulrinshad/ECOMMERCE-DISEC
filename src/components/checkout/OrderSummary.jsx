import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useCartStore } from '../../store/cartStore'
import PromoCode from './PromoCode'
import gsap from 'gsap'

export const OrderSummary = ({ shippingFee, discountPercent, onApplyPromo, promoCode }) => {
  const { cartItems, getCartTotal } = useCartStore()
  
  const subtotal = getCartTotal()
  const discountAmount = subtotal * discountPercent
  const discountedSubtotal = subtotal - discountAmount
  const vat = discountedSubtotal * 0.20
  const total = discountedSubtotal + shippingFee + vat

  const totalDisplayRef = useRef(null)
  const prevTotalRef = useRef(total)

  // GSAP Count Animation for the Total
  useEffect(() => {
    if (totalDisplayRef.current) {
      const obj = { val: prevTotalRef.current }
      gsap.to(obj, {
        val: total,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          if (totalDisplayRef.current) {
            totalDisplayRef.current.innerText = `$${obj.val.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          }
        }
      })
      prevTotalRef.current = total
    }
  }, [total])

  return (
    <div className="bg-white p-8 md:p-10 border border-[#D8D3CA] md:sticky md:top-[100px] transition-all duration-300">
      <h2 className="font-display text-xl font-extrabold uppercase tracking-widest text-[#0A0A0A] mb-8">
        YOUR ACQUISITION
      </h2>

      {/* Cart Items list */}
      <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 mb-8">
        {cartItems.map((item) => (
          <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Thumbnail with Qty Badge */}
              <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute -top-2 -right-2 bg-[#1A3C2E] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-body font-bold">
                  {item.quantity}
                </span>
              </div>

              <div>
                <h4 className="font-display text-xs font-bold uppercase tracking-tight text-[#0A0A0A] line-clamp-1">
                  {item.name}
                </h4>
                <p className="font-body text-[10px] uppercase tracking-widest text-[#5C5C5C] mt-0.5">
                  SZ: {item.selectedSize} / CLR: {item.selectedColor}
                </p>
              </div>
            </div>

            <div className="font-display text-xs font-bold text-[#0A0A0A] ml-4">
              ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>

      <hr className="border-[#D8D3CA] my-6" />

      {/* Promo Code entry */}
      <PromoCode onApplyPromo={onApplyPromo} currentDiscount={discountPercent} />

      <hr className="border-[#D8D3CA] my-6" />

      {/* Calculations */}
      <div className="space-y-3 font-body text-xs text-[#5C5C5C]">
        <div className="flex justify-between">
          <span className="uppercase tracking-widest font-light">SUBTOTAL</span>
          <span className="font-medium text-[#0A0A0A]">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        {discountPercent > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="uppercase tracking-widest font-medium">DISCOUNT ({promoCode})</span>
            <span className="font-medium">-${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="uppercase tracking-widest font-light">SHIPPING</span>
          <span className="font-medium text-[#0A0A0A]">
            {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="uppercase tracking-widest font-light">VAT (20%)</span>
          <span className="font-medium text-[#0A0A0A]">${vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <hr className="border-[#D8D3CA] my-4" />

        <div className="flex justify-between items-baseline pt-2">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-[#0A0A0A]">TOTAL</span>
          <span 
            ref={totalDisplayRef} 
            className="font-display text-2xl font-extrabold text-[#0A0A0A]"
          >
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="border-t border-[#D8D3CA] mt-8 pt-6 space-y-3">
        <div className="flex items-center text-[#5C5C5C] space-x-3 text-[10px] font-body font-light tracking-wider uppercase">
          <span>🔒</span>
          <span>SECURE ACQUISITION PROTOCOL</span>
        </div>
        <div className="flex items-center text-[#5C5C5C] space-x-3 text-[10px] font-body font-light tracking-wider uppercase">
          <span>📦</span>
          <span>FREE RETURNS WITHIN 14 DAYS</span>
        </div>
        <div className="flex items-center text-[#5C5C5C] space-x-3 text-[10px] font-body font-light tracking-wider uppercase">
          <span>✦</span>
          <span>ARCHIVAL MEMBER POINTS EARNED</span>
        </div>
      </div>
    </div>
  )
}

OrderSummary.propTypes = {
  shippingFee: PropTypes.number.isRequired,
  discountPercent: PropTypes.number.isRequired,
  onApplyPromo: PropTypes.func.isRequired,
  promoCode: PropTypes.string.isRequired
}

export default OrderSummary
