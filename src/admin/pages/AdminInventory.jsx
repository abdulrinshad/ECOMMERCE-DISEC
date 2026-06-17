import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAdminStore } from '../store/adminStore'
import DataGrid from '../components/DataGrid'
import toast from 'react-hot-toast'
import { FiEdit, FiSearch, FiAlertTriangle, FiCheck } from 'react-icons/fi'

export const AdminInventory = () => {
  const { accessToken } = useAuth()
  const { inventory, pagination, fetchInventory, updateStock, isLoading } = useAdminStore()

  // State
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editStockVal, setEditStockVal] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)

  const loadInventory = () => {
    if (accessToken) {
      fetchInventory(accessToken, {
        page: currentPage,
        limit: 10,
        search
      })
    }
  }

  useEffect(() => {
    loadInventory()
  }, [accessToken, currentPage])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    loadInventory()
  }

  const handleEditInit = (row) => {
    setEditingId(row._id)
    setEditStockVal(row.stock)
  }

  const handleStockUpdateSubmit = async (productId) => {
    setIsUpdating(true)
    try {
      await updateStock(accessToken, productId, Number(editStockVal))
      toast.success('INVENTORY COUNTS ADJUSTED')
      setEditingId(null)
      loadInventory()
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    } finally {
      setIsUpdating(false)
    }
  }

  const columns = useMemo(() => [
    {
      key: 'image',
      label: 'Preview',
      width: '80px',
      render: (row) => (
        <img
          src={row.thumbnail || ''}
          alt={row.name}
          className="w-10 h-12 object-cover bg-[#F2EFE9] border border-[#D8D3CA]"
        />
      )
    },
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'stock',
      label: 'Stock Quantity',
      render: (row) => {
        const isEditing = editingId === row._id
        const isLow = row.stock <= 5

        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={editStockVal}
                onChange={(e) => setEditStockVal(e.target.value)}
                className="w-20 bg-[#F2EFE9] border border-[#D8D3CA] px-2 py-1 text-xs font-body text-[#0A0A0A] focus:outline-none"
              />
              <button
                onClick={() => handleStockUpdateSubmit(row._id)}
                disabled={isUpdating}
                className="bg-[#1A3C2E] text-white p-1 hover:bg-[#2D6B4F] cursor-pointer border-none flex items-center justify-center"
              >
                <FiCheck size={14} />
              </button>
            </div>
          )
        }

        return (
          <div className="flex items-center gap-3">
            <span className={`font-bold ${isLow ? 'text-red-700 font-black' : ''}`}>{row.stock} Units</span>
            {isLow && (
              <span className="flex items-center gap-0.5 bg-red-50 text-red-800 border border-red-200 px-1.5 py-0.5 text-[7px] font-extrabold tracking-widest uppercase">
                <FiAlertTriangle size={8} />
                <span>Low Stock</span>
              </span>
            )}
          </div>
        )
      }
    },
    {
      key: 'actions',
      label: 'Inventory Control',
      width: '120px',
      render: (row) => {
        const isEditing = editingId === row._id
        if (isEditing) {
          return (
            <button
              onClick={() => setEditingId(null)}
              className="text-[#5C5C5C] hover:text-[#0A0A0A] bg-transparent border-none cursor-pointer font-display text-[9px] font-extrabold"
            >
              CANCEL
            </button>
          )
        }
        return (
          <button
            onClick={() => handleEditInit(row)}
            className="text-[#1A3C2E] hover:text-[#2D6B4F] bg-transparent border-none cursor-pointer flex items-center gap-1 font-display text-[9px] font-extrabold"
          >
            <FiEdit size={12} />
            <span>ADJUST</span>
          </button>
        )
      }
    }
  ], [accessToken, editingId, editStockVal, isUpdating])

  return (
    <div className="space-y-8 uppercase">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0A]">
          INVENTORY MANAGEMENT
        </h1>
        <p className="font-body text-[10px] text-[#7C766C] tracking-widest mt-1">
          STOCK LEVEL CONTROL LOGS
        </p>
      </div>

      {/* Search Filter Row */}
      <div className="bg-white border border-[#D8D3CA] p-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH SKU OR PRODUCT NAME..."
            className="w-full bg-[#F2EFE9] border border-[#D8D3CA] pl-8 pr-4 py-2 font-body text-[10px] uppercase tracking-wider text-[#0A0A0A] focus:border-[#1A3C2E] focus:outline-none"
          />
          <FiSearch className="absolute left-2.5 top-3 text-[#7C766C]" size={12} />
        </form>
      </div>

      {/* DataGrid */}
      <DataGrid
        columns={columns}
        items={inventory}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setCurrentPage}
        emptyMessage="No catalog items matched query filters."
      />

    </div>
  )
}

export default AdminInventory
