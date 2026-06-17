import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FiGrid,
  FiShoppingBag,
  FiTruck,
  FiUsers,
  FiMessageSquare,
  FiLayers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiSearch,
  FiUser
} from 'react-icons/fi'
import toast from 'react-hot-toast'

export const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, accessToken } = useAuth()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Guard: Restrict access to authenticated admins only
  useEffect(() => {
    if (!accessToken) {
      navigate('/login')
      return
    }
    if (user && user.role !== 'admin') {
      toast.error('ACCESS RESTRICTED: ADMIN CREDENTIALS REQUIRED')
      navigate('/dashboard')
    }
  }, [accessToken, user, navigate])

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiGrid size={16} /> },
    { name: 'Products', path: '/admin/products', icon: <FiShoppingBag size={16} /> },
    { name: 'Orders', path: '/admin/orders', icon: <FiTruck size={16} /> },
    { name: 'Customers', path: '/admin/customers', icon: <FiUsers size={16} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <FiMessageSquare size={16} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <FiLayers size={16} /> },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: <FiFileText size={16} /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings size={16} /> }
  ]

  const handleLogout = async () => {
    await logout()
    toast.success('ADMIN DE-AUTHORIZED')
    navigate('/login')
  }

  // Calculate breadcrumbs from location pathname
  const paths = location.pathname.split('/').filter(x => x)
  const breadcrumbs = paths.map((path, index) => {
    const routeTo = `/${paths.slice(0, index + 1).join('/')}`
    const label = path === 'admin' ? 'SYSTEM CONTROL' : path.replace(/-/g, ' ').toUpperCase()
    const isLast = index === paths.length - 1
    return { label, routeTo, isLast }
  })

  if (!user || user.role !== 'admin') {
    return null // Return blank during redirects
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#0A0A0A] flex flex-col md:flex-row">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-[#0A0A0A] text-white p-6 border-r border-[#D8D3CA]/10 select-none">
        <div className="space-y-10">
          {/* Logo / System Info */}
          <div>
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.2em] block text-[#F2EFE9]">
              AVANT-GARDE
            </span>
            <span className="font-body text-[9px] uppercase tracking-widest text-[#7C766C] mt-1 block">
              CONTROL CONSOLE V1.0
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col space-y-4">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/')
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 py-2 px-3 font-display text-[10px] font-bold uppercase tracking-widest transition-all ${
                    isActive 
                      ? 'bg-[#1A3C2E] text-white border-l-2 border-white' 
                      : 'text-[#7C766C] hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-2 px-3 font-display text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors border-none bg-transparent cursor-pointer"
        >
          <FiLogOut size={16} />
          <span>DE-AUTHORIZE</span>
        </button>
      </aside>

      {/* 2. Responsive Mobile Drawer */}
      <div className="md:hidden bg-[#0A0A0A] text-white px-6 py-4 flex justify-between items-center border-b border-[#D8D3CA]/10">
        <span className="font-display text-xs font-bold uppercase tracking-widest">
          AVANT-GARDE ADMIN
        </span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white bg-transparent border-none cursor-pointer"
        >
          {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0A0A0A] text-white z-50 p-8 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-[#D8D3CA]/10 pb-4">
              <span className="font-display text-sm font-extrabold uppercase tracking-widest">
                SYSTEM MENU
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-transparent border-none text-white cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 py-3 px-2 font-display text-xs font-bold uppercase tracking-widest text-[#7C766C] hover:text-white"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          
          <button
            onClick={() => {
              setIsMobileMenuOpen(false)
              handleLogout()
            }}
            className="flex items-center gap-4 py-3 px-2 font-display text-xs font-bold uppercase tracking-widest text-red-500 cursor-pointer"
          >
            <FiLogOut size={16} />
            <span>DE-AUTHORIZE</span>
          </button>
        </div>
      )}

      {/* 3. Main content body pane */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Row */}
        <header className="bg-white border-b border-[#D8D3CA] px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 font-display text-[9px] font-extrabold uppercase tracking-wider text-[#7C766C]">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.routeTo} className="flex items-center">
                {idx > 0 && <span className="mx-2 text-[#D8D3CA] font-bold">/</span>}
                {crumb.isLast ? (
                  <span className="text-[#0A0A0A]">{crumb.label}</span>
                ) : (
                  <Link to={crumb.routeTo} className="hover:text-[#0A0A0A] transition-colors">{crumb.label}</Link>
                )}
              </span>
            ))}
          </div>

          {/* Interactive Utility bar */}
          <div className="flex items-center gap-6 justify-end">
            
            {/* Search Bar */}
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="SEARCH ARCHIVES..."
                className="bg-[#F2EFE9] border border-[#D8D3CA] pl-8 pr-4 py-1.5 rounded-none font-body text-[10px] uppercase tracking-wider text-[#0A0A0A] focus:border-[#1A3C2E] focus:outline-none w-48 transition-all focus:w-60"
              />
              <FiSearch className="absolute left-2.5 top-2.5 text-[#7C766C]" size={12} />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative bg-transparent border-none text-[#0A0A0A] hover:text-[#1A3C2E] transition-colors cursor-pointer p-1"
              >
                <FiBell size={18} />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#C8102E]" />
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-[#D8D3CA] shadow-lg py-2 z-30 select-none">
                  <div className="px-4 py-1 border-b border-[#D8D3CA]/60 font-display text-[9px] font-extrabold uppercase tracking-widest text-[#7C766C]">
                    System Alerts
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-[#D8D3CA]/30">
                    <div className="p-3 text-[10px] font-body text-[#0A0A0A] hover:bg-[#F2EFE9] transition-colors">
                      <p className="font-bold">LOW STOCK REPORT</p>
                      <p className="text-[9px] text-[#7C766C]">Product "SHELL HOOD" counts dropped below threshold.</p>
                    </div>
                    <div className="p-3 text-[10px] font-body text-[#0A0A0A] hover:bg-[#F2EFE9] transition-colors">
                      <p className="font-bold">PENDING REGISTRATIONS</p>
                      <p className="text-[9px] text-[#7C766C]">3 reviews waiting for system moderation approvals.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menus */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-[#F2EFE9] border border-[#D8D3CA] px-3 py-1 text-xs font-display font-bold uppercase tracking-wider text-[#0A0A0A] cursor-pointer hover:bg-neutral-100 transition-colors"
              >
                <FiUser size={12} />
                <span>{user.fullName.split(' ')[0]}</span>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white border border-[#D8D3CA] shadow-lg py-2 z-30 select-none">
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-[10px] font-display font-extrabold uppercase tracking-widest text-[#0A0A0A] hover:bg-[#F2EFE9]"
                  >
                    MEMBER PORTAL
                  </Link>
                  <button 
                    onClick={() => {
                      setIsUserMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full text-left block px-4 py-2 text-[10px] font-display font-extrabold uppercase tracking-widest text-red-600 hover:bg-[#F2EFE9] border-none bg-transparent cursor-pointer"
                  >
                    LOG OUT
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Content Outlet Box */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default AdminLayout
