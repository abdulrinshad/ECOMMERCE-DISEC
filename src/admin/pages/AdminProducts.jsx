import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAdminStore } from '../store/adminStore'
import DataGrid from '../components/DataGrid'
import ProductForm from '../components/ProductForm'
import { ALLOWED_CATEGORIES } from '../../constants/product.constants.js'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi'

export const AdminProducts = () => {
  const { accessToken } = useAuth()
  const { products, pagination, fetchProducts, createProduct, updateProduct, deleteProduct, isLoading } = useAdminStore()

  // Filters & State
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch product list
  const loadProducts = () => {
    if (accessToken) {
      fetchProducts(accessToken, {
        page: currentPage,
        limit: 10,
        search,
        category: selectedCategory,
        status: selectedStatus
      })
    }
  }

  useEffect(() => {
    loadProducts()
  }, [accessToken, currentPage, selectedCategory, selectedStatus])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    loadProducts()
  }

  const handleCreateOrEditSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      if (editingProduct) {
        await updateProduct(accessToken, editingProduct._id, values)
        toast.success('PRODUCT UPDATED')
      } else {
        await createProduct(accessToken, values)
        toast.success('PRODUCT CREATED')
      }
      setIsFormOpen(false)
      setEditingProduct(null)
      loadProducts()
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to permanently delete this product?')) {
      try {
        await deleteProduct(accessToken, productId)
        toast.success('PRODUCT LOG TERMINATED')
        loadProducts()
      } catch (err) {
        toast.error(err.message || 'Delete failed')
      }
    }
  }

  const handleEditInit = (product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  // DataGrid Columns Definition
  const columns = useMemo(() => [
    {
      key: 'image',
      label: 'Image',
      width: '80px',
      render: (row) => (
        <img
          src={row.thumbnail || (row.images && row.images[0]) || ''}
          alt={row.name}
          className="w-10 h-12 object-cover bg-[#F2EFE9] border border-[#D8D3CA]"
        />
      )
    },
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    {
      key: 'price',
      label: 'Price',
      render: (row) => `$${row.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    },
    { key: 'stock', label: 'Stock' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-0.5 font-display text-[8px] font-extrabold uppercase tracking-wider border select-none ${row.status === 'active'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : row.status === 'draft'
            ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
            : 'bg-gray-100 text-gray-700 border-gray-300'
          }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (row) => (
        <div className="flex gap-4">
          <button
            onClick={() => handleEditInit(row)}
            className="text-[#1A3C2E] hover:text-[#2D6B4F] bg-transparent border-none cursor-pointer flex items-center gap-1 font-display text-[9px] font-extrabold"
          >
            <FiEdit size={12} />
            <span>EDIT</span>
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-700 hover:text-red-800 bg-transparent border-none cursor-pointer flex items-center gap-1 font-display text-[9px] font-extrabold"
          >
            <FiTrash2 size={12} />
            <span>DELETE</span>
          </button>
        </div>
      )
    }
  ], [accessToken])

  return (
    <div className="space-y-8 uppercase">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0A]">
            PRODUCTS ARCHIVE
          </h1>
          <p className="font-body text-[10px] text-[#7C766C] tracking-widest mt-1">
            CATALOG MANAGEMENT LOGS
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null)
            setIsFormOpen(true)
          }}
          className="bg-[#1A3C2E] hover:bg-[#2D6B4F] text-white px-5 py-3 font-display text-[10px] font-extrabold tracking-widest border-none flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <FiPlus size={14} />
          <span>CREATE PRODUCT</span>
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="bg-white border border-[#D8D3CA] p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH PRODUCTS..."
            className="w-full bg-[#F2EFE9] border border-[#D8D3CA] pl-8 pr-4 py-2 font-body text-[10px] uppercase tracking-wider text-[#0A0A0A] focus:border-[#1A3C2E] focus:outline-none"
          />
          <FiSearch className="absolute left-2.5 top-3 text-[#7C766C]" size={12} />
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end font-display text-[9px] font-extrabold">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent border-b border-[#D8D3CA] text-xs font-body tracking-wider focus:outline-none py-1 cursor-pointer"
          >
            <option value="">ALL CATEGORIES</option>
            {ALLOWED_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat.toUpperCase()}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent border-b border-[#D8D3CA] text-xs font-body tracking-wider focus:outline-none py-1 cursor-pointer"
          >
            <option value="">ALL STATUSES</option>
            <option value="draft">DRAFT</option>
            <option value="active">ACTIVE</option>
            <option value="archived">ARCHIVED</option>
          </select>
        </div>
      </div>

      {/* DataGrid */}
      <DataGrid
        columns={columns}
        items={products}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setCurrentPage}
        emptyMessage="No product files matches active query parameters."
      />

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-[#0A0A0A]/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-3xl z-10">
            <ProductForm
              initialData={editingProduct}
              onSubmit={handleCreateOrEditSubmit}
              onCancel={() => setIsFormOpen(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminProducts
