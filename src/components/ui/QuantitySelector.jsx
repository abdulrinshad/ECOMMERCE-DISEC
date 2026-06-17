import React from 'react'

const QuantitySelector = ({ quantity, setQuantity, maxStock = 10 }) => {
  const maxAllowed = Math.min(maxStock, 10)

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const handleIncrement = () => {
    if (quantity < maxAllowed) setQuantity(quantity + 1)
  }

  return (
    <div className="flex items-center border border-[#D8D3CA] w-max">
      <button
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="px-4 py-3 text-[#0A0A0A] font-body text-xs transition-colors hover:bg-[#EAE6DF] disabled:opacity-50 disabled:hover:bg-transparent"
        aria-label="Decrease quantity"
      >
        —
      </button>
      <div className="w-12 text-center font-body text-sm font-semibold text-[#0A0A0A]">
        {quantity}
      </div>
      <button
        onClick={handleIncrement}
        disabled={quantity >= maxAllowed}
        className="px-4 py-3 text-[#0A0A0A] font-body text-xs transition-colors hover:bg-[#EAE6DF] disabled:opacity-50 disabled:hover:bg-transparent"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  )
}

export default QuantitySelector
