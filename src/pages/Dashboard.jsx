import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FiGrid,
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiLogOut
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { products } from '../data/products'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { toast } from 'react-hot-toast'

export const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const revealRef = useScrollReveal()
  const { user, logout } = useAuth()

  // Sidebar navigation options
  const navItems = [
    { name: 'DASHBOARD', icon: <FiGrid size={16} />, path: '/dashboard' },
    { name: 'PROFILE', icon: <FiUser size={16} />, path: '/dashboard' },
    { name: 'ORDERS', icon: <FiShoppingBag size={16} />, path: '/dashboard/orders' },
    { name: 'WISHLIST', icon: <FiHeart size={16} />, path: '/dashboard/wishlist' },
    { name: 'SETTINGS', icon: <FiSettings size={16} />, path: '/dashboard/settings' }
  ]

  // Determine active tab from URL path
  let activeTab = 'PROFILE'
  if (location.pathname === '/dashboard/orders') {
    activeTab = 'ORDERS'
  } else if (location.pathname === '/dashboard/wishlist') {
    activeTab = 'WISHLIST'
  } else if (location.pathname === '/dashboard/settings') {
    activeTab = 'SETTINGS'
  } else {
    activeTab = 'PROFILE'
  }

  // Mock order list items using product image references
  const orders = [
    {
      id: "ORD-9428-A",
      productName: "SYNTHETIC DISTORTION PARKA",
      price: 1450.00,
      image: products[0]?.images[0] || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=100&auto=format&fit=crop",
      status: "PROCESSING",
      statusVariant: "dark"
    },
    {
      id: "ORD-8942-X",
      productName: "MONO-CONSTRUCTION SHELL",
      price: 1240.00,
      image: products[1]?.images[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=100&auto=format&fit=crop",
      status: "SHIPPED",
      statusVariant: "green"
    },
    {
      id: "ORD-7312-C",
      productName: "STATIC MEMBRANE TROUSER",
      price: 890.00,
      image: products[2]?.images[0] || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=100&auto=format&fit=crop",
      status: "DELIVERED",
      statusVariant: "outline"
    }
  ]

  const handleSignOut = async () => {
    await logout()
    toast.success('DE-AUTHORIZED')
    navigate('/')
  }

  const handleUpdateIdentity = (e) => {
    e.preventDefault()
    toast.success('IDENTITY PROFILE SECURED')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    const currentPassword = e.target.currentPassword.value
    const newPassword = e.target.newPassword.value
    const confirmPassword = e.target.confirmPassword.value

    if (newPassword !== confirmPassword) {
      toast.error('Keys do not match')
      return
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken || ''}`
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      })

      const responseData = await res.json()
      if (!res.ok) {
        throw new Error(responseData.message || 'Failed to change password')
      }

      toast.success('Password changed. Re-authenticating.')
      await logout()
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  const userInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'ME'

  return (
    <main className="w-full min-h-screen flex bg-[#F2EFE9] pt-20">
      
      {/* 1. Left Sidebar Panel */}
      <aside className="w-64 bg-[#1A3C2E] text-white flex flex-col justify-between p-8 min-h-[calc(100vh-80px)] border-r border-[#D8D3CA]/20">
        <div className="space-y-12">
          {/* Logo / Tag */}
          <div className="select-none">
            <span className="font-display text-sm font-extrabold uppercase tracking-widest block">
              MEMBER PORTAL
            </span>
            <span className="font-body text-[9px] uppercase tracking-widest text-[#E8E4DC]/60 mt-1 block">
              EST. 2024 / ID: {user?.id?.substring(0, 6) || '9482'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.name || (activeTab === 'PROFILE' && item.name === 'DASHBOARD')
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-4 font-body text-xs font-medium uppercase tracking-[0.12em] transition-colors relative pb-1 w-max ${
                    isActive ? 'text-white' : 'text-[#E8E4DC]/60 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white animate-scale-x"></span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 font-body text-xs font-medium uppercase tracking-[0.12em] text-[#E8E4DC]/60 hover:text-white transition-colors focus:outline-none"
        >
          <FiLogOut size={16} />
          <span>SIGN OUT</span>
        </button>
      </aside>

      {/* 2. Main Dashboard Content */}
      <section
        ref={revealRef}
        className="flex-1 p-8 md:p-12 space-y-12 overflow-y-auto max-w-6xl"
      >
        {/* Header Row: Title & Member Card */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#D8D3CA] pb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
              MEMBER ARCHIVES
            </h1>
            <p className="font-body text-xs text-[#5C5C5C] uppercase tracking-widest mt-1">
              PORTAL STATUS ACTIVE
            </p>
          </div>

          {/* User Card */}
          <div className="flex items-center gap-4 bg-[#E8E4DC] border border-[#D8D3CA] px-5 py-3">
            {/* Circular Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#1A3C2E] flex items-center justify-center font-display text-white text-xs font-bold select-none">
              {userInitials}
            </div>
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-wide text-[#0A0A0A] block">
                {user?.fullName || 'GUEST MEMBER'}
              </span>
              <span className="font-body text-[9px] uppercase tracking-widest text-[#1A3C2E] font-semibold mt-0.5 block">
                LEVEL: {user?.memberLevel || 'ARCHIVAL MEMBER'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab-driven layouts */}
        {activeTab === 'PROFILE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: PROFILE */}
            <div className="lg:col-span-6 space-y-10">
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-[#0A0A0A] border-b border-[#D8D3CA] pb-3 mb-6">
                  IDENTITY PROFILE
                </h2>
                <form onSubmit={handleUpdateIdentity} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.fullName || ''}
                      className="w-full bg-transparent border-b border-[#D8D3CA] focus:border-[#1A3C2E] py-2 text-xs font-body tracking-wider focus:outline-none uppercase text-[#0A0A0A]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="w-full bg-transparent border-b border-[#D8D3CA] focus:border-[#1A3C2E] py-2 text-xs font-body tracking-wider focus:outline-none uppercase text-[#0A0A0A]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
                      SHIPPING DESTINATION
                    </label>
                    <input
                      type="text"
                      defaultValue="METROPOLIS GRID 07, SECTOR 4"
                      className="w-full bg-transparent border-b border-[#D8D3CA] focus:border-[#1A3C2E] py-2 text-xs font-body tracking-wider focus:outline-none uppercase text-[#0A0A0A]"
                    />
                  </div>

                  <Button variant="outline" type="submit" className="px-6 py-3 text-[10px] tracking-widest font-semibold mt-4">
                    UPDATE IDENTITY
                  </Button>
                </form>
              </div>

              {/* Exclusive Card Banner */}
              <div className="bg-[#E8E4DC] border border-[#D8D3CA] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#1A3C2E] text-white">EARLY ACCESS</Badge>
                  <span className="font-body text-[9px] uppercase tracking-widest text-[#5C5C5C] font-medium">
                    SERIES 045: PENDING
                  </span>
                </div>
                <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-[#0A0A0A]">
                  EXCLUSIVES UNLOCKED
                </h3>
                <p className="font-body text-xs text-[#5C5C5C] leading-relaxed uppercase">
                  YOUR IDENTITY ACCEPTS PRE-DROP RESERVATION FOR THE KINETIC SHIELD HOOD. DROP STARTS IN 48 HOURS.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="font-body text-[10px] font-bold uppercase tracking-widest text-[#1A3C2E] hover:text-[#2D6B4F] transition-colors inline-block mt-2"
                >
                  VIEW ARCHIVES →
                </button>
              </div>
            </div>

            {/* Right Column: HISTORY */}
            <div className="lg:col-span-6 space-y-8">
              <div className="flex justify-between items-baseline border-b border-[#D8D3CA] pb-3 mb-6">
                <h2 className="font-display text-lg font-bold uppercase tracking-wider text-[#0A0A0A]">
                  ORDER ARCHIVE
                </h2>
                <span className="font-body text-[10px] uppercase tracking-widest text-[#5C5C5C]">
                  {orders.length} TOTAL ITEMS
                </span>
              </div>

              {/* Order Cards */}
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#D8D3CA] p-5 flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={order.image}
                        alt={order.productName}
                        className="w-14 h-18 object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-display text-xs font-bold uppercase tracking-tight text-[#0A0A0A]">
                          {order.productName}
                        </h4>
                        <span className="font-body text-[9px] uppercase tracking-widest text-[#5C5C5C] mt-1 block">
                          ORDER ID: {order.id}
                        </span>
                        <span className="font-body text-xs font-semibold text-[#0A0A0A] mt-2 block">
                          ${order.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-between items-end md:justify-between h-full min-h-[72px]">
                      <div>
                        {order.status === 'PROCESSING' && (
                          <span className="inline-block bg-[#0A0A0A] text-white text-[8px] font-bold tracking-widest uppercase px-2.5 py-0.5 select-none">
                            PROCESSING
                          </span>
                        )}
                        {order.status === 'SHIPPED' && (
                          <span className="inline-block bg-[#1A3C2E] text-white text-[8px] font-bold tracking-widest uppercase px-2.5 py-0.5 select-none">
                            SHIPPED
                          </span>
                        )}
                        {order.status === 'DELIVERED' && (
                          <span className="inline-block border border-[#1A3C2E] text-[#1A3C2E] text-[8px] font-bold tracking-widest uppercase px-2.5 py-0.5 select-none bg-transparent">
                            DELIVERED
                          </span>
                        )}
                      </div>

                      <div className="flex gap-4 font-body text-[9px] font-bold uppercase tracking-widest text-[#0A0A0A] mt-2 md:mt-0">
                        <button type="button" className="hover:underline transition-all text-[#5C5C5C] hover:text-[#0A0A0A]">DETAILS</button>
                        <button type="button" className="hover:underline transition-all text-[#5C5C5C] hover:text-[#0A0A0A]">TRACK</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ORDERS' && (
          <div className="space-y-8 max-w-3xl">
            <div className="flex justify-between items-baseline border-b border-[#D8D3CA] pb-3">
              <h2 className="font-display text-lg font-bold uppercase tracking-wider text-[#0A0A0A]">
                YOUR ORDER ARCHIVE
              </h2>
              <span className="font-body text-[10px] uppercase tracking-widest text-[#5C5C5C]">
                {orders.length} TOTAL ITEMS
              </span>
            </div>

            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#D8D3CA] p-5 flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={order.image}
                      alt={order.productName}
                      className="w-14 h-18 object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-display text-xs font-bold uppercase tracking-tight text-[#0A0A0A]">
                        {order.productName}
                      </h4>
                      <span className="font-body text-[9px] uppercase tracking-widest text-[#5C5C5C] mt-1 block">
                        ORDER ID: {order.id}
                      </span>
                      <span className="font-body text-xs font-semibold text-[#0A0A0A] mt-2 block">
                        ${order.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col justify-between items-end md:justify-between h-full min-h-[72px]">
                    <div>
                      {order.status === 'PROCESSING' && (
                        <span className="inline-block bg-[#0A0A0A] text-white text-[8px] font-bold tracking-widest uppercase px-2.5 py-0.5 select-none">
                          PROCESSING
                        </span>
                      )}
                      {order.status === 'SHIPPED' && (
                        <span className="inline-block bg-[#1A3C2E] text-white text-[8px] font-bold tracking-widest uppercase px-2.5 py-0.5 select-none">
                          SHIPPED
                        </span>
                      )}
                      {order.status === 'DELIVERED' && (
                        <span className="inline-block border border-[#1A3C2E] text-[#1A3C2E] text-[8px] font-bold tracking-widest uppercase px-2.5 py-0.5 select-none bg-transparent">
                          DELIVERED
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 font-body text-[9px] font-bold uppercase tracking-widest text-[#0A0A0A] mt-2 md:mt-0">
                      <button type="button" className="hover:underline transition-all text-[#5C5C5C] hover:text-[#0A0A0A]">DETAILS</button>
                      <button type="button" className="hover:underline transition-all text-[#5C5C5C] hover:text-[#0A0A0A]">TRACK</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'WISHLIST' && (
          <div className="space-y-8 max-w-3xl">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-[#0A0A0A] border-b border-[#D8D3CA] pb-3">
              YOUR WISHLIST VAULT
            </h2>
            <div className="border border-dashed border-[#D8D3CA] p-12 text-center select-none space-y-4">
              <p className="font-body text-xs text-[#5C5C5C] uppercase tracking-widest">
                YOUR ARCHIVE VAULT IS CURRENTLY EMPTY.
              </p>
              <Button onClick={() => navigate('/shop')} variant="solid" className="px-6 py-3 text-[10px] tracking-widest uppercase font-semibold">
                DISCOVER DESIGNS
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="space-y-8 max-w-md">
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-[#0A0A0A] border-b border-[#D8D3CA] pb-3 mb-6">
              SECURITY PROTOCOL SETTINGS
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
                  CURRENT SECRET KEY
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  className="w-full bg-transparent border-b border-[#D8D3CA] focus:border-[#1A3C2E] py-2 text-xs font-body tracking-wider focus:outline-none text-[#0A0A0A]"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
                  NEW SECRET KEY
                </label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  className="w-full bg-transparent border-b border-[#D8D3CA] focus:border-[#1A3C2E] py-2 text-xs font-body tracking-wider focus:outline-none text-[#0A0A0A]"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
                  CONFIRM NEW SECRET KEY
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full bg-transparent border-b border-[#D8D3CA] focus:border-[#1A3C2E] py-2 text-xs font-body tracking-wider focus:outline-none text-[#0A0A0A]"
                  placeholder="••••••••"
                />
              </div>

              <Button variant="solid" type="submit" className="w-full py-4 text-[10px] tracking-widest font-semibold mt-4 uppercase">
                RE-INITIALIZE PASSWORD
              </Button>
            </form>
          </div>
        )}
      </section>
    </main>
  )
}

export default Dashboard
