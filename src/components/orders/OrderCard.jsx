import React from 'react'
import { useNavigate } from 'react-router-dom'
import OrderStatusBadge from './OrderStatusBadge'

export const OrderCard = ({ order }) => {
  const navigate = useNavigate()
  
  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Calculate items count
  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-white border border-[#D8D3CA] p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow duration-300">
      
      {/* Left section: details & preview */}
      <div className="flex gap-4 items-start">
        {/* Item image preview (first item) */}
        {order.items && order.items[0] && (
          <img
            src={order.items[0].image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=100&auto=format&fit=crop"}
            alt={order.items[0].name}
            className="w-16 h-20 object-cover bg-[#F2EFE9] border border-[#D8D3CA] flex-shrink-0"
          />
        )}
        
        <div className="space-y-1">
          <span className="font-display text-[9px] font-extrabold uppercase tracking-widest text-[#5C5C5C] block">
            Acquisition Protocol
          </span>
          <h4 className="font-display text-sm font-extrabold uppercase tracking-tight text-[#0A0A0A]">
            {order.orderNumber}
          </h4>
          <span className="font-body text-xs text-[#5C5C5C] block">
            Initiated {formattedDate}
          </span>
          <span className="font-body text-xs text-[#0A0A0A] font-bold block pt-1">
            {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'} — ${order.pricing.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Right section: status & action */}
      <div className="flex flex-row md:flex-col justify-between items-end md:justify-between h-full min-h-[72px] self-stretch">
        <OrderStatusBadge status={order.status} />

        <button 
          type="button" 
          onClick={() => navigate(`/orders/${order._id}`)}
          className="font-display text-[10px] font-extrabold uppercase tracking-widest text-[#1A3C2E] hover:text-[#2D6B4F] transition-colors mt-2 md:mt-0 underline decoration-[1.5px] underline-offset-4 cursor-pointer"
        >
          VIEW DETAILS →
        </button>
      </div>

    </div>
  )
}

export default React.memo(OrderCard)
