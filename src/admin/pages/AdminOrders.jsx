import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAdminStore } from '../store/adminStore'
import DataGrid from '../components/DataGrid'
import OrderStatusBadge from '../../components/orders/OrderStatusBadge'
import toast from 'react-hot-toast'
import { FiEdit, FiSearch, FiEye, FiX } from 'react-icons/fi'

export const AdminOrders = () => {
  const { accessToken } = useAuth()
  const { orders, pagination, fetchOrders, updateOrderStatus, isLoading } = useAdminStore()

  // State
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('')
  const [activeOrderDetails, setActiveOrderDetails] = useState(null)
  
  // Status update modal state
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [newStatus, setNewStatus] = useState('pending')
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadOrders = () => {
    if (accessToken) {
      const filters = {
        page: currentPage,
        limit: 10
      }
      if (selectedStatusFilter) filters.status = selectedStatusFilter.toLowerCase()
      fetchOrders(accessToken, filters)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [accessToken, currentPage, selectedStatusFilter])

  const handleStatusUpdateInit = (order) => {
    setUpdatingOrderId(order._id)
    setNewStatus(order.status)
    setStatusMessage('')
  }

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await updateOrderStatus(accessToken, updatingOrderId, newStatus, statusMessage)
      toast.success('ORDER PROTOCOL STATUS UPDATED')
      setUpdatingOrderId(null)
      loadOrders()
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = useMemo(() => [
    { key: 'orderNumber', label: 'Order Number' },
    {
      key: 'customer',
      label: 'Customer',
      render: (row) => (
        <div>
          <span className="font-bold block">{row.shippingAddress.firstName} {row.shippingAddress.lastName}</span>
          <span className="text-[10px] text-[#7C766C] block">{row.customer?.email || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      key: 'total',
      label: 'Total',
      render: (row) => `$${row.pricing.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    },
    {
      key: 'status',
      label: 'Fulfillment Status',
      render: (row) => <OrderStatusBadge status={row.status} />
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (row) => (
        <span className="font-display text-[9px] font-extrabold uppercase tracking-wider">
          {row.paymentStatus}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '180px',
      render: (row) => (
        <div className="flex gap-4 font-display text-[9px] font-extrabold">
          <button
            onClick={() => setActiveOrderDetails(row)}
            className="text-[#1A3C2E] hover:text-[#2D6B4F] bg-transparent border-none cursor-pointer flex items-center gap-1"
          >
            <FiEye size={12} />
            <span>DETAILS</span>
          </button>
          <button
            onClick={() => handleStatusUpdateInit(row)}
            className="text-neutral-900 hover:text-neutral-700 bg-transparent border-none cursor-pointer flex items-center gap-1"
          >
            <FiEdit size={12} />
            <span>STATUS</span>
          </button>
        </div>
      )
    }
  ], [accessToken])

  return (
    <div className="space-y-8 uppercase">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0A]">
          ORDERS ARCHIVE
        </h1>
        <p className="font-body text-[10px] text-[#7C766C] tracking-widest mt-1">
          FULFILLMENT PROTOCOL LOGS
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-[#D8D3CA] p-4 flex justify-between items-center">
        <span className="font-display text-[9px] font-extrabold text-[#7C766C]">Filter By Fulfiller:</span>
        <select
          value={selectedStatusFilter}
          onChange={(e) => {
            setSelectedStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="bg-transparent border-b border-[#D8D3CA] text-xs font-body tracking-wider focus:outline-none py-1 cursor-pointer font-extrabold"
        >
          <option value="">ALL STATUSES</option>
          <option value="pending">PENDING</option>
          <option value="confirmed">CONFIRMED</option>
          <option value="processing">PROCESSING</option>
          <option value="shipped">SHIPPED</option>
          <option value="out_for_delivery">OUT FOR DELIVERY</option>
          <option value="delivered">DELIVERED</option>
          <option value="cancelled">CANCELLED</option>
          <option value="refunded">REFUNDED</option>
        </select>
      </div>

      {/* DataGrid */}
      <DataGrid
        columns={columns}
        items={orders}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setCurrentPage}
        emptyMessage="No orders found matching the filter query."
      />

      {/* Details Dialog */}
      {activeOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setActiveOrderDetails(null)} className="absolute inset-0 bg-[#0A0A0A]/50 backdrop-blur-sm" />
          <div className="relative bg-[#F2EFE9] border border-[#D8D3CA] w-full max-w-2xl p-8 z-10 shadow-xl max-h-[85vh] overflow-y-auto uppercase">
            <div className="flex justify-between items-center border-b border-[#D8D3CA] pb-4">
              <h2 className="font-display text-lg font-extrabold tracking-tight text-[#0A0A0A]">
                Acquisition File: {activeOrderDetails.orderNumber}
              </h2>
              <button onClick={() => setActiveOrderDetails(null)} className="bg-transparent border-none text-[#0A0A0A] cursor-pointer">
                <FiX size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 font-body text-xs text-[#0A0A0A] tracking-wide">
              {/* Shipping */}
              <div className="space-y-2">
                <span className="font-display text-[9px] font-extrabold text-[#7C766C] block">
                  Delivery Destination
                </span>
                <p className="font-bold">{activeOrderDetails.shippingAddress.firstName} {activeOrderDetails.shippingAddress.lastName}</p>
                <p>{activeOrderDetails.shippingAddress.address1}</p>
                {activeOrderDetails.shippingAddress.address2 && <p>{activeOrderDetails.shippingAddress.address2}</p>}
                <p>{activeOrderDetails.shippingAddress.city}, {activeOrderDetails.shippingAddress.postalCode}</p>
                <p>{activeOrderDetails.shippingAddress.country}</p>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <span className="font-display text-[9px] font-extrabold text-[#7C766C] block">
                  Purchased Items
                </span>
                <div className="space-y-2 divide-y divide-[#D8D3CA]/30 max-h-40 overflow-y-auto pr-2">
                  {activeOrderDetails.items.map((item, index) => (
                    <div key={index} className="pt-2 first:pt-0 flex justify-between gap-4">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-[10px] text-[#7C766C]">QTY: {item.quantity}</p>
                      </div>
                      <span className="font-bold font-display text-[11px]">${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-[#D8D3CA] mt-6">
              <button
                onClick={() => setActiveOrderDetails(null)}
                className="bg-[#0A0A0A] text-white px-6 py-3 font-display text-[10px] font-bold uppercase tracking-widest cursor-pointer border-none"
              >
                CLOSE FILE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Dialog */}
      {updatingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setUpdatingOrderId(null)} className="absolute inset-0 bg-[#0A0A0A]/50 backdrop-blur-sm" />
          <form onSubmit={handleStatusSubmit} className="relative bg-white border border-[#D8D3CA] w-full max-w-md p-8 z-10 shadow-xl space-y-6">
            <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-[#0A0A0A] border-b border-[#D8D3CA]/60 pb-2">
              ALTER FULFILLMENT PROTOCOL STATUS
            </h3>

            <div className="space-y-2">
              <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
                Select Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A] cursor-pointer"
              >
                <option value="pending">PENDING</option>
                <option value="confirmed">CONFIRMED</option>
                <option value="processing">PROCESSING</option>
                <option value="shipped">SHIPPED</option>
                <option value="out_for_delivery">OUT FOR DELIVERY</option>
                <option value="delivered">DELIVERED</option>
                <option value="cancelled">CANCELLED</option>
                <option value="refunded">REFUNDED</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
                Fulfillment Log Message (Optional)
              </label>
              <input
                type="text"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="E.G. DEPARTED WAREHOUSE GRID 09"
                className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => setUpdatingOrderId(null)}
                disabled={isSubmitting}
                className="flex-grow bg-transparent hover:bg-neutral-100 text-[#0A0A0A] border border-[#D8D3CA] py-4 font-display text-[10px] font-bold uppercase tracking-widest transition-colors duration-200"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-grow bg-[#1A3C2E] hover:bg-[#2D6B4F] text-white border-none py-4 font-display text-[10px] font-extrabold uppercase tracking-widest transition-colors duration-200"
              >
                {isSubmitting ? 'SAVING...' : 'UPDATE'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}

export default AdminOrders
