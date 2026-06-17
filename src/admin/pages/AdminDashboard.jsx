import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAdminStore } from '../store/adminStore'
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiLayers,
  FiClock,
  FiMessageSquare,
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi'

export const AdminDashboard = () => {
  const { accessToken } = useAuth()
  const { kpis, analytics, fetchDashboardKPIs, fetchAnalytics, isLoading } = useAdminStore()

  useEffect(() => {
    if (accessToken) {
      fetchDashboardKPIs(accessToken)
      fetchAnalytics(accessToken)
    }
  }, [accessToken, fetchDashboardKPIs, fetchAnalytics])

  if (isLoading && !kpis) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-10 h-10 border-2 border-t-[#1A3C2E] border-r-transparent border-b-[#1A3C2E] border-l-transparent rounded-full animate-spin" />
        <span className="font-display text-[9px] font-extrabold uppercase tracking-widest text-[#7C766C]">
          Querying dashboard KPIs...
        </span>
      </div>
    )
  }

  // Fallback defaults
  const stats = kpis || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    pendingReviews: 0,
    lowStockProducts: 0,
    refundRequests: 0
  }

  const chartData = analytics || {
    revenueTrend: [],
    topCategories: [],
    topSelling: [],
    customerGrowth: [],
    reviewsDist: []
  }

  const kpiCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: <FiDollarSign size={16} />, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <FiShoppingBag size={16} />, color: 'text-blue-700 bg-blue-50' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: <FiUsers size={16} />, color: 'text-indigo-700 bg-indigo-50' },
    { label: 'Total Products', value: stats.totalProducts, icon: <FiLayers size={16} />, color: 'text-purple-700 bg-purple-50' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: <FiClock size={16} />, color: 'text-amber-700 bg-amber-50' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: <FiMessageSquare size={16} />, color: 'text-yellow-700 bg-yellow-50' },
    { label: 'Low Stock Alerts', value: stats.lowStockProducts, icon: <FiAlertTriangle size={16} />, color: 'text-red-700 bg-red-50' },
    { label: 'Refund Requests', value: stats.refundRequests, icon: <FiRefreshCw size={16} />, color: 'text-orange-700 bg-orange-50' }
  ]

  return (
    <div className="space-y-8 uppercase">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0A]">
          SYSTEM DASHBOARD
        </h1>
        <p className="font-body text-[10px] text-[#7C766C] tracking-widest mt-1">
          OPERATIONAL STATE CONSOLE
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white border border-[#D8D3CA] p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-2">
              <span className="font-display text-[9px] font-extrabold tracking-widest text-[#7C766C] block">
                {card.label}
              </span>
              <span className="font-display text-xl font-black text-[#0A0A0A] block">
                {card.value}
              </span>
            </div>
            <div className={`p-3 rounded-none ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Lists / Dynamic progress visual bars (Alternative to chart libraries for bulletproof build compilation) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* Top Categories Stocks */}
        <div className="bg-white border border-[#D8D3CA] p-6 space-y-6">
          <span className="font-display text-[10px] font-extrabold tracking-widest text-[#0A0A0A] block border-b border-[#D8D3CA]/60 pb-2">
            Inventory Category Distribution
          </span>
          <div className="space-y-4">
            {chartData.topCategories.length === 0 ? (
              <p className="font-body text-xs text-[#7C766C] text-center">No categories recorded.</p>
            ) : (
              chartData.topCategories.map((cat) => {
                const totalStock = chartData.topCategories.reduce((sum, item) => sum + item.count, 0)
                const share = totalStock > 0 ? (cat.count / totalStock) * 100 : 0
                return (
                  <div key={cat._id} className="space-y-1.5">
                    <div className="flex justify-between font-display text-[9px] font-extrabold tracking-widest text-[#5C5C5C]">
                      <span>{cat._id || 'UNASSIGNED'}</span>
                      <span>{cat.count} PIECES ({share.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-[#F2EFE9] border border-[#D8D3CA]/50 relative overflow-hidden">
                      <div className="h-full bg-[#1A3C2E]" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white border border-[#D8D3CA] p-6 space-y-6">
          <span className="font-display text-[10px] font-extrabold tracking-widest text-[#0A0A0A] block border-b border-[#D8D3CA]/60 pb-2">
            Top Selling Products by Units
          </span>
          <div className="space-y-4">
            {chartData.topSelling.length === 0 ? (
              <p className="font-body text-xs text-[#7C766C] text-center">No transactions completed.</p>
            ) : (
              chartData.topSelling.map((prod) => {
                const maxSold = Math.max(...chartData.topSelling.map(p => p.unitsSold), 1)
                const share = (prod.unitsSold / maxSold) * 100
                return (
                  <div key={prod._id} className="space-y-1.5">
                    <div className="flex justify-between font-display text-[9px] font-extrabold tracking-widest text-[#5C5C5C]">
                      <span className="truncate max-w-[70%]">{prod.name || 'UNKNOWN PRODUCT'}</span>
                      <span>{prod.unitsSold} SOLD (${prod.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
                    </div>
                    <div className="h-2 bg-[#F2EFE9] border border-[#D8D3CA]/50 relative overflow-hidden">
                      <div className="h-full bg-neutral-900" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>

    </div>
  )
}

export default AdminDashboard
