import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuth } from '../context/AuthContext'
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi'

export const CartPage = () => {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const { cartItems, cartSummary, fetchCart, updateQuantity, removeItem } = useCartStore()

  useEffect(() => {
    if (accessToken) {
      fetchCart(accessToken)
    }
  }, [accessToken, fetchCart])

  const subtotal = cartSummary?.subtotal || 0
  const shippingFee = cartSummary?.shipping || 0
  const tax = cartSummary?.tax || 0
  const grandTotal = cartSummary?.grandTotal || 0

  const handleQuantityChange = (item, newQuantity) => {
    updateQuantity(item.id, item.selectedSize, item.selectedColor, newQuantity, accessToken)
  }

  const handleRemove = (item) => {
    removeItem(item.id, item.selectedSize, item.selectedColor, accessToken)
  }

  const handleCheckoutClick = () => {
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        
        {/* Title Section */}
        <div className="overflow-hidden border-b border-[#D8D3CA] pb-6">
          <span className="font-body text-xs font-bold uppercase tracking-widest text-[#5C5C5C] block mb-2">
            Aesthetic Inventory
          </span>
          <h1 className="font-display text-4xl md:text-7xl font-extrabold uppercase tracking-tight text-[#0A0A0A] leading-none">
            SHOPPING CART
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="border border-dashed border-[#D8D3CA] p-16 text-center space-y-6 bg-white/40">
            <h3 className="font-display text-lg font-extrabold uppercase tracking-widest text-[#0A0A0A]">
              YOUR CART IS CURRENTLY EMPTY
            </h3>
            <p className="font-body text-xs text-[#7C766C] uppercase max-w-sm mx-auto leading-relaxed">
              No registered catalog items found. Explore the drops to select items for checkout.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-[#1A3C2E] hover:bg-[#2D6B4F] text-white px-8 py-4 font-display text-[10px] font-extrabold uppercase tracking-[0.15em] border-none transition-all active:scale-[0.98] cursor-pointer"
            >
              DISCOVER DROPS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Columns: Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="bg-white border border-[#D8D3CA] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-6">
                     <img
                      src={item.thumbnail || item.images?.[0] || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=100&auto=format&fit=crop'}
                      alt={item.name}
                      className="w-20 h-24 object-cover object-center bg-gray-100 flex-shrink-0"
                    />
                    <div className="space-y-2">
                      <h3 className="font-display text-sm font-bold uppercase tracking-tight text-[#0A0A0A] leading-tight">
                        {item.name}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 font-body text-[9px] uppercase tracking-widest text-[#5C5C5C]">
                        <span>SIZE: {item.selectedSize || 'O/S'}</span>
                        <span>COLOR: {item.selectedColor || 'DEFAULT'}</span>
                      </div>
                      <span className="font-body text-xs font-semibold text-[#0A0A0A] block">
                        ${item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center w-full sm:w-auto gap-4">
                    <div className="flex items-center gap-4">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-[#D8D3CA]">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="px-2 py-1.5 text-[#0A0A0A] hover:bg-gray-100 transition-colors"
                        >
                          <FiMinus size={10} />
                        </button>
                        <span className="px-3 py-1 font-body text-xs font-medium text-[#0A0A0A] min-w-[32px] text-center select-none">
                          {String(item.quantity).padStart(2, '0')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="px-2 py-1.5 text-[#0A0A0A] hover:bg-gray-100 transition-colors"
                        >
                          <FiPlus size={10} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors p-2"
                        title="Remove Item"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    <span className="font-body text-xs font-bold text-[#0A0A0A]">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary Card (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-[#D8D3CA] p-8 space-y-6">
              <h2 className="font-display text-xs font-extrabold uppercase tracking-[0.15em] text-[#0A0A0A] border-b border-[#D8D3CA] pb-4">
                ORDER PROTOCOL SUMMARY
              </h2>

              <div className="space-y-4 font-body text-xs text-[#5C5C5C] uppercase tracking-wider">
                <div className="flex justify-between">
                  <span>CART SUB-TOTAL</span>
                  <span className="text-[#0A0A0A] font-semibold">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING ESTIMATE</span>
                  <span className="text-[#0A0A0A] font-semibold">
                    {shippingFee === 0 ? 'FREE DELIVERY' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ESTIMATED TAX (20% VAT)</span>
                  <span className="text-[#0A0A0A] font-semibold">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="border-t border-[#D8D3CA] pt-4 flex justify-between items-baseline text-[#0A0A0A]">
                  <span className="font-semibold text-xs tracking-widest">GRAND TOTAL</span>
                  <span className="font-display text-lg font-extrabold">
                    ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#1A3C2E] hover:bg-[#2D6B4F] text-white py-4 flex items-center justify-center gap-3 font-display text-[10px] font-extrabold uppercase tracking-[0.15em] border-none transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>INITIATE CHECKOUT</span>
                <FiArrowRight size={12} />
              </button>

              <div className="pt-2 text-center text-[#5C5C5C] font-body text-[9px] uppercase tracking-widest leading-relaxed">
                Taxes and delivery shipping are recalculated based on final delivery targets during payment stages.
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
