import React from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const AccountDropdown = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user || !isOpen) return null

  const handleSignOut = async () => {
    onClose()
    await logout()
    navigate('/')
  }

  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Member'

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#D8D3CA] shadow-xl z-50 rounded-none overflow-hidden animate-slide-down"
      style={{
        animation: 'slideDown 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      <div className="p-4 border-b border-[#D8D3CA] select-none">
        <p className="font-body text-[9px] font-semibold text-[#5C5C5C] tracking-widest uppercase">
          WELCOME
        </p>
        <p className="font-display text-xs font-extrabold text-[#0A0A0A] tracking-wider uppercase mt-1">
          HI, {firstName}
        </p>
      </div>
      
      <div className="flex flex-col py-1">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="px-4 py-2.5 font-body text-[10px] font-semibold tracking-wider text-[#0A0A0A] hover:bg-[#F2EFE9] hover:text-[#1A3C2E] transition-colors uppercase text-left"
        >
          My Account
        </Link>
        <Link
          to="/dashboard/orders"
          onClick={onClose}
          className="px-4 py-2.5 font-body text-[10px] font-semibold tracking-wider text-[#0A0A0A] hover:bg-[#F2EFE9] hover:text-[#1A3C2E] transition-colors uppercase text-left"
        >
          Orders
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="px-4 py-2.5 font-body text-[10px] font-semibold tracking-wider text-red-700 hover:bg-[#F2EFE9] hover:text-red-900 transition-colors uppercase text-left border-t border-[#D8D3CA]/40 focus:outline-none"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

AccountDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default AccountDropdown
