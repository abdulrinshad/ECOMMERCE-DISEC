import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrderStore } from '../store/orderStore'
import OrderCard from '../components/orders/OrderCard'
import gsap from 'gsap'

export const OrdersPage = () => {
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const { orders, pagination, fetchOrders, isLoading, error } = useOrderStore()

  // Local state for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1)
  const [activeStatusFilter, setActiveStatusFilter] = useState('ALL')

  // Available status tabs for aesthetic filtering
  const statusTabs = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

  // Fetch orders when page, status, or token changes
  useEffect(() => {
    if (accessToken) {
      const filters = {
        page: currentPage,
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      if (activeStatusFilter !== 'ALL') {
        filters.status = activeStatusFilter.toLowerCase()
      }
      fetchOrders(accessToken, filters)
    }
  }, [accessToken, currentPage, activeStatusFilter, fetchOrders])

  // GSAP Title Animations on Mount
  useEffect(() => {
    const titleWords = document.querySelectorAll('.orders-title-word')
    gsap.fromTo(titleWords,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    )
  }, [])

  // Memoized order list rendering to prevent recalculations
  const renderedOrders = useMemo(() => {
    if (orders.length === 0) return null
    return orders.map((order) => (
      <div key={order._id} className="order-item-animate">
        <OrderCard order={order} />
      </div>
    ))
  }, [orders])

  const handleStatusChange = (status) => {
    setActiveStatusFilter(status)
    setCurrentPage(1) // Reset to first page
  }

  // Handle Return to Shop
  const handleReturnToShop = () => {
    navigate('/shop')
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Page Title & Subtitle Header */}
        <div className="overflow-hidden border-b border-[#D8D3CA] pb-6">
          <span className="orders-title-word font-body text-xs font-bold uppercase tracking-widest text-[#5C5C5C] block mb-2">
            Acquisition History
          </span>
          <h1 className="orders-title-word font-display text-4xl md:text-6xl font-extrabold uppercase tracking-tight text-[#0A0A0A] leading-none">
            MY ORDERS
          </h1>
        </div>

        {/* Muted Premium Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-[#D8D3CA]/60">
          {statusTabs.map((tab) => {
            const isActive = activeStatusFilter === tab
            return (
              <button
                key={tab}
                onClick={() => handleStatusChange(tab)}
                className={`px-4 py-2 font-display text-[9px] font-extrabold uppercase tracking-widest border transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-[#1A3C2E] border-[#1A3C2E] text-white' 
                    : 'bg-white border-[#D8D3CA] text-[#7C766C] hover:border-[#1A3C2E] hover:text-[#0A0A0A]'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-2 border-t-[#1A3C2E] border-r-transparent border-b-[#1A3C2E] border-l-transparent rounded-full animate-spin" />
            <span className="font-display text-[10px] font-extrabold tracking-widest text-[#7C766C] uppercase">
              Querying archive protocol...
            </span>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 p-6 text-center text-red-800 font-display text-xs font-extrabold uppercase tracking-widest">
            Protocol Error: {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="border border-dashed border-[#D8D3CA] p-16 text-center space-y-6 bg-white/40">
            <h3 className="font-display text-lg font-extrabold uppercase tracking-widest text-[#0A0A0A]">
              YOUR ACQUISITION ARCHIVE IS EMPTY
            </h3>
            <p className="font-body text-xs text-[#7C766C] uppercase max-w-sm mx-auto leading-relaxed">
              No registered order files found for your credentials. Explore the designs catalog to begin your acquisition protocol.
            </p>
            <button
              onClick={handleReturnToShop}
              className="bg-[#1A3C2E] hover:bg-[#2D6B4F] text-white px-8 py-4 font-display text-[10px] font-extrabold uppercase tracking-[0.15em] border-none transition-all active:scale-[0.98] cursor-pointer"
            >
              RETURN TO SHOP
            </button>
          </div>
        )}

        {/* Order Cards Grid */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {renderedOrders}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-[#D8D3CA]">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 font-display text-[9px] font-extrabold uppercase tracking-widest border border-[#D8D3CA] bg-white disabled:opacity-40 cursor-pointer"
                >
                  ← Previous
                </button>
                <span className="font-display text-[10px] font-extrabold uppercase tracking-widest text-[#7C766C]">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="px-4 py-2 font-display text-[9px] font-extrabold uppercase tracking-widest border border-[#D8D3CA] bg-white disabled:opacity-40 cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default React.memo(OrdersPage)
