import React from 'react'
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useCartStore } from '../../store/cartStore'
import { useAuth } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

export const CartDrawer = () => {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const {
    cartItems,
    cartSummary,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem
  } = useCartStore()

  const subtotal = cartSummary?.subtotal || 0

  const handleDecreaseQuantity = (item) => {
    updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1, accessToken)
  }

  const handleIncreaseQuantity = (item) => {
    updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1, accessToken)
  }

  const handleRemoveItem = (item) => {
    removeItem(item.id, item.selectedSize, item.selectedColor, accessToken)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#E8E4DC]/60 z-50 transition-opacity duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-50 shadow-2xl flex flex-col justify-between transition-transform duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[#D8D3CA]">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-widest text-[#0A0A0A]">
            YOUR CART
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="text-[#0A0A0A] hover:text-[#5C5C5C] transition-colors p-2 cursor-pointer bg-transparent border-none"
            aria-label="Close Cart"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 select-none">
              <p className="font-body text-sm text-[#5C5C5C] uppercase tracking-wider">
                Cart is empty.
              </p>
              <Link
                to="/shop"
                onClick={closeDrawer}
                className="font-body text-xs font-semibold uppercase tracking-[0.12em] underline text-[#0A0A0A] hover:text-[#5C5C5C]"
              >
                Go to Archives
              </Link>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}>
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.thumbnail || item.images?.[0] || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=100&auto=format&fit=crop'}
                    alt={item.name}
                    className="w-20 h-24 object-cover object-center bg-gray-100 flex-shrink-0"
                  />
                  
                  {/* Content details */}
                  <div className="flex-1 flex flex-col justify-between min-h-[96px]">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-display text-sm font-bold uppercase tracking-tight leading-tight text-[#0A0A0A]">
                          {item.name}
                        </h3>
                        <span className="font-body text-xs font-medium text-[#0A0A0A] whitespace-nowrap">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-body text-[10px] uppercase tracking-widest text-[#5C5C5C] mt-1">
                        SIZE: {item.selectedSize || 'O/S'} / COLOR: {item.selectedColor || 'DEFAULT'}
                      </p>
                    </div>

                    {/* Stepper / Delete */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#D8D3CA]">
                        <button
                          type="button"
                          onClick={() => handleDecreaseQuantity(item)}
                          className="px-2 py-1 text-[#0A0A0A] hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={10} />
                        </button>
                        <span className="px-3 py-1 font-body text-xs font-medium text-[#0A0A0A] min-w-[32px] text-center select-none">
                          {String(item.quantity).padStart(2, '0')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncreaseQuantity(item)}
                          className="px-2 py-1 text-[#0A0A0A] hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={10} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item)}
                        className="text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors p-1 cursor-pointer border-none bg-transparent"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                {index < cartItems.length - 1 && (
                  <hr className="border-[#D8D3CA] mt-6" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Checkout Pinned Section */}
        {cartItems.length > 0 && (
          <div className="border-t border-[#D8D3CA] p-6 bg-white space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="font-body text-xs font-semibold uppercase tracking-widest text-[#5C5C5C]">
                SUBTOTAL
              </span>
              <span className="font-display text-xl font-extrabold text-[#0A0A0A]">
                ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  navigate('/cart')
                  closeDrawer()
                }}
                className="w-full bg-transparent hover:bg-[#F2EFE9] text-[#0A0A0A] border border-[#D8D3CA] py-4 text-center font-display text-[10px] font-extrabold uppercase tracking-widest cursor-pointer"
              >
                VIEW CART
              </button>
              <Button
                variant="solid"
                className="w-full py-4 text-center font-display tracking-widest"
                onClick={() => {
                  navigate('/checkout')
                  closeDrawer()
                }}
              >
                CHECKOUT
              </Button>
            </div>
            
            <p className="font-body text-[9px] uppercase tracking-widest text-[#5C5C5C] text-center">
              SHIPPING & TAXES CALCULATED AT CHECKOUT
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
