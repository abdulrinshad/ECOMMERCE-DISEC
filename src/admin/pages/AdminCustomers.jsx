import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAdminStore } from '../store/adminStore'
import DataGrid from '../components/DataGrid'
import toast from 'react-hot-toast'
import { FiLock, FiUnlock, FiSearch } from 'react-icons/fi'

export const AdminCustomers = () => {
  const { accessToken } = useAuth()
  const { customers, pagination, fetchCustomers, blockCustomer, unblockCustomer, isLoading } = useAdminStore()

  // State
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')

  const loadCustomers = () => {
    if (accessToken) {
      fetchCustomers(accessToken, {
        page: currentPage,
        limit: 10,
        search
      })
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [accessToken, currentPage])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    loadCustomers()
  }

  const handleBlockToggle = async (customer) => {
    const isLocked = customer.loginLockUntil && new Date(customer.loginLockUntil) > new Date()
    const confirmMsg = isLocked 
      ? `Unlock account for ${customer.fullName}?` 
      : `Block account for ${customer.fullName}? Customer will not be able to log in.`;

    if (window.confirm(confirmMsg)) {
      try {
        if (isLocked) {
          await unblockCustomer(accessToken, customer._id)
          toast.success('CUSTOMER ACCOUNT UNLOCKED')
        } else {
          await blockCustomer(accessToken, customer._id)
          toast.success('CUSTOMER ACCOUNT LOCKED')
        }
        loadCustomers()
      } catch (err) {
        toast.error(err.message || 'Operation failed')
      }
    }
  }

  const columns = useMemo(() => [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email Address' },
    {
      key: 'orderCount',
      label: 'Order Count',
      render: (row) => `${row.orderCount || 0} Orders`
    },
    {
      key: 'totalSpend',
      label: 'Total Spend',
      render: (row) => `$${(row.totalSpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    },
    {
      key: 'status',
      label: 'Account Status',
      render: (row) => {
        const isLocked = row.loginLockUntil && new Date(row.loginLockUntil) > new Date()
        return (
          <span className={`px-2 py-0.5 font-display text-[8px] font-extrabold uppercase tracking-wider border select-none ${
            isLocked 
              ? 'bg-red-50 text-red-800 border-red-200' 
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {isLocked ? 'LOCKED / BLOCKED' : 'ACTIVE'}
          </span>
        )
      }
    },
    {
      key: 'actions',
      label: 'Access Control',
      width: '150px',
      render: (row) => {
        const isLocked = row.loginLockUntil && new Date(row.loginLockUntil) > new Date()
        return (
          <button
            onClick={() => handleBlockToggle(row)}
            className={`bg-transparent border-none cursor-pointer flex items-center gap-1 font-display text-[9px] font-extrabold uppercase tracking-widest ${
              isLocked ? 'text-emerald-700 hover:text-emerald-800' : 'text-red-700 hover:text-red-800'
            }`}
          >
            {isLocked ? (
              <>
                <FiUnlock size={12} />
                <span>UNLOCK</span>
              </>
            ) : (
              <>
                <FiLock size={12} />
                <span>LOCK / BLOCK</span>
              </>
            )}
          </button>
        )
      }
    }
  ], [accessToken])

  return (
    <div className="space-y-8 uppercase">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0A]">
          CUSTOMERS DIRECTORY
        </h1>
        <p className="font-body text-[10px] text-[#7C766C] tracking-widest mt-1">
          USER ACCOUNTS REGISTRY
        </p>
      </div>

      {/* Search Filter Row */}
      <div className="bg-white border border-[#D8D3CA] p-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH BY NAME OR EMAIL..."
            className="w-full bg-[#F2EFE9] border border-[#D8D3CA] pl-8 pr-4 py-2 font-body text-[10px] uppercase tracking-wider text-[#0A0A0A] focus:border-[#1A3C2E] focus:outline-none"
          />
          <FiSearch className="absolute left-2.5 top-3 text-[#7C766C]" size={12} />
        </form>
      </div>

      {/* DataGrid */}
      <DataGrid
        columns={columns}
        items={customers}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setCurrentPage}
        emptyMessage="No customer records match active search queries."
      />

    </div>
  )
}

export default AdminCustomers
