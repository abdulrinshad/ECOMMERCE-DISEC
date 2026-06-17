import React from 'react'

export const OrderStatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    const s = (status || '').toLowerCase()
    switch (s) {
      case 'pending':
        return {
          bg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          label: 'PENDING PROTOCOL'
        }
      case 'confirmed':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          label: 'CONFIRMED'
        }
      case 'processing':
        return {
          bg: 'bg-neutral-900 text-white border-neutral-900',
          label: 'PROCESSING'
        }
      case 'shipped':
        return {
          bg: 'bg-emerald-950 text-emerald-50 border-emerald-900',
          label: 'DEPARTED / SHIPPED'
        }
      case 'out_for_delivery':
        return {
          bg: 'bg-indigo-950 text-indigo-50 border-indigo-900',
          label: 'OUT FOR DELIVERY'
        }
      case 'delivered':
        return {
          bg: 'bg-transparent text-[#1A3C2E] border-[#1A3C2E] border',
          label: 'DELIVERED ✓'
        }
      case 'cancelled':
        return {
          bg: 'bg-red-50 text-red-800 border-red-200',
          label: 'CANCELLED PROTOCOL'
        }
      case 'refunded':
        return {
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          label: 'REFUNDED'
        }
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 border-gray-200',
          label: s.toUpperCase()
        }
    }
  }

  const { bg, label } = getStatusStyles(status)

  return (
    <span className={`inline-block px-3 py-1 font-display text-[9px] font-extrabold tracking-widest uppercase border select-none transition-all duration-300 ${bg}`}>
      {label}
    </span>
  )
}

export default React.memo(OrderStatusBadge)
