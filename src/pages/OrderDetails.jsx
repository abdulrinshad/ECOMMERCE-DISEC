import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrderStore } from '../store/orderStore'
import OrderTimeline from '../components/orders/OrderTimeline'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import CancelOrderModal from '../components/orders/CancelOrderModal'
import { toast } from 'react-hot-toast'
import gsap from 'gsap'

export const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const { currentOrder, fetchOrderById, cancelOrder, isLoading, error } = useOrderStore()

  // Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    if (accessToken && id) {
      fetchOrderById(accessToken, id)
    }
  }, [accessToken, id, fetchOrderById])

  // GSAP animations on page loads
  useEffect(() => {
    if (currentOrder) {
      const elements = document.querySelectorAll('.animate-detail-fade')
      gsap.fromTo(elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      )
    }
  }, [currentOrder])

  // Recalculate formatted date
  const orderDate = useMemo(() => {
    if (!currentOrder) return ''
    return new Date(currentOrder.createdAt).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [currentOrder])

  // Check if order is eligible for cancellation
  const isEligibleForCancellation = useMemo(() => {
    if (!currentOrder) return false
    return ['pending', 'confirmed'].includes(currentOrder.status.toLowerCase())
  }, [currentOrder])

  const handleCancelConfirm = async (reason) => {
    setIsCancelling(true)
    try {
      await cancelOrder(accessToken, currentOrder._id, reason)
      toast.success('ACQUISITION TERMINATED SUCCESSFUL')
      setIsCancelModalOpen(false)
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order.')
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2EFE9] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-t-[#1A3C2E] border-r-transparent border-b-[#1A3C2E] border-l-transparent rounded-full animate-spin" />
        <span className="font-display text-[10px] font-extrabold tracking-widest text-[#7C766C] uppercase">
          RETRIEVING ACQUISITION FILE...
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2EFE9] pt-28 px-6 text-center space-y-4">
        <div className="bg-red-50 border border-red-200 max-w-md mx-auto p-6 text-red-800 font-display text-xs font-extrabold uppercase tracking-widest">
          Failed to fetch order: {error}
        </div>
        <button 
          onClick={() => navigate('/orders')}
          className="font-display text-xs font-bold uppercase tracking-widest text-[#1A3C2E] hover:underline"
        >
          ← Return to Orders
        </button>
      </div>
    )
  }

  if (!currentOrder) return null

  return (
    <div className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center border-b border-[#D8D3CA] pb-6">
          <button
            onClick={() => navigate('/orders')}
            className="font-display text-[10px] font-bold uppercase tracking-widest text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors cursor-pointer"
          >
            ← BACK TO ARCHIVES
          </button>
          <div className="flex items-center gap-4">
            <span className="font-body text-[9px] uppercase tracking-widest text-[#5C5C5C]">
              Payment Status:
            </span>
            <span className="font-display text-[10px] font-extrabold uppercase tracking-wider text-[#1A3C2E]">
              {currentOrder.paymentStatus}
            </span>
          </div>
        </div>

        {/* Main Details Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Order Header / General Meta (Left 2 cols) */}
          <div className="md:col-span-2 space-y-8 animate-detail-fade">
            <div>
              <span className="font-body text-xs uppercase tracking-widest text-[#5C5C5C] block">
                Acquisition File Summary
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-[#0A0A0A] mt-1">
                {currentOrder.orderNumber}
              </h1>
              <p className="font-body text-xs text-[#5C5C5C] mt-2 uppercase tracking-wide">
                Authorized on {orderDate}
              </p>
            </div>

            {/* Tracking timeline */}
            <div className="bg-white border border-[#D8D3CA] p-6 md:p-8">
              <span className="font-display text-[10px] font-extrabold uppercase tracking-widest text-[#0A0A0A] block mb-4 border-b border-[#D8D3CA]/60 pb-2">
                Fulfillment Protocol Progress
              </span>
              <OrderTimeline status={currentOrder.status} />
            </div>

            {/* Items Purchased List */}
            <div className="bg-white border border-[#D8D3CA] p-6 space-y-6">
              <span className="font-display text-[10px] font-extrabold uppercase tracking-widest text-[#0A0A0A] block border-b border-[#D8D3CA]/60 pb-2">
                Acquisition Items ({currentOrder.items.length})
              </span>
              
              <div className="divide-y divide-[#D8D3CA]/60">
                {currentOrder.items.map((item) => (
                  <div key={item._id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=100&auto=format&fit=crop"}
                      alt={item.name}
                      className="w-16 h-20 object-cover bg-[#F2EFE9] border border-[#D8D3CA]"
                    />
                    <div className="flex-grow space-y-1">
                      <h4 className="font-display text-xs font-bold uppercase tracking-tight text-[#0A0A0A]">
                        {item.name}
                      </h4>
                      <span className="block font-body text-[10px] text-[#7C766C] uppercase tracking-wide">
                        SKU: {item.sku || 'N/A'}
                      </span>
                      <span className="block font-body text-[10px] text-[#7C766C] uppercase tracking-wide">
                        Size: {item.variantId?.split('_')[1] || 'Default'} | Color: {item.variantId?.split('_')[2] || 'Default'}
                      </span>
                      <div className="flex justify-between items-baseline pt-2">
                        <span className="font-body text-xs text-[#5C5C5C]">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-display text-xs font-bold text-[#0A0A0A]">
                          ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar details (1 col) */}
          <div className="space-y-6 animate-detail-fade">
            
            {/* Status overview */}
            <div className="bg-white border border-[#D8D3CA] p-6 space-y-4">
              <span className="font-display text-[9px] font-extrabold uppercase tracking-widest text-[#7C766C] block">
                Order Protocol Status
              </span>
              <OrderStatusBadge status={currentOrder.status} />

              {isEligibleForCancellation && (
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 font-display text-[10px] font-bold uppercase tracking-widest border border-red-200 transition-colors duration-200 mt-4 cursor-pointer"
                >
                  CANCEL PROTOCOL
                </button>
              )}
            </div>

            {/* Shipping details */}
            <div className="bg-white border border-[#D8D3CA] p-6 space-y-3">
              <span className="font-display text-[9px] font-extrabold uppercase tracking-widest text-[#7C766C] block">
                Destination Address
              </span>
              <div className="font-body text-xs text-[#0A0A0A] uppercase space-y-1 tracking-wide">
                <p className="font-bold">{currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}</p>
                <p>{currentOrder.shippingAddress.address1}</p>
                {currentOrder.shippingAddress.address2 && <p>{currentOrder.shippingAddress.address2}</p>}
                <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}</p>
                <p>{currentOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Recalculated pricing summary */}
            <div className="bg-white border border-[#D8D3CA] p-6 space-y-4">
              <span className="font-display text-[9px] font-extrabold uppercase tracking-widest text-[#7C766C] block">
                Financial Protocol Breakdown
              </span>
              
              <div className="space-y-2 border-b border-[#D8D3CA]/60 pb-3 font-body text-xs uppercase tracking-wider text-[#5C5C5C]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${currentOrder.pricing.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {currentOrder.pricing.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>-${currentOrder.pricing.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>${currentOrder.pricing.shippingFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (20%)</span>
                  <span>${currentOrder.pricing.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex justify-between font-display text-sm font-extrabold uppercase tracking-widest text-[#0A0A0A]">
                <span>Grand Total</span>
                <span>${currentOrder.pricing.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Cancel Order Modal overlay dialog */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        isProcessing={isCancelling}
      />
    </div>
  )
}

export default React.memo(OrderDetails)
