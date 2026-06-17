import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAdminStore } from '../store/adminStore'
import DataGrid from '../components/DataGrid'
import StarRating from '../../components/reviews/StarRating'
import toast from 'react-hot-toast'
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi'

export const AdminReviews = () => {
  const { accessToken } = useAuth()
  const { reviews, pagination, fetchReviews, approveReview, rejectReview, deleteReview, isLoading } = useAdminStore()

  // State
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState('')

  const loadReviews = () => {
    if (accessToken) {
      const filters = {
        page: currentPage,
        limit: 10
      }
      if (selectedStatus) filters.status = selectedStatus.toLowerCase()
      fetchReviews(accessToken, filters)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [accessToken, currentPage, selectedStatus])

  const handleApprove = async (reviewId) => {
    try {
      await approveReview(accessToken, reviewId)
      toast.success('REVIEW APPROVED & PUBLISHED')
      loadReviews()
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  const handleReject = async (reviewId) => {
    try {
      await rejectReview(accessToken, reviewId)
      toast.success('REVIEW REJECTED')
      loadReviews()
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to permanently delete this review?')) {
      try {
        await deleteReview(accessToken, reviewId)
        toast.success('REVIEW LOG TERMINATED')
        loadReviews()
      } catch (err) {
        toast.error(err.message || 'Delete failed')
      }
    }
  }

  const columns = useMemo(() => [
    {
      key: 'product',
      label: 'Product',
      render: (row) => row.product?.name || 'N/A'
    },
    {
      key: 'user',
      label: 'Reviewer',
      render: (row) => (
        <div>
          <span className="font-bold block">{row.user?.fullName || 'N/A'}</span>
          <span className="text-[10px] text-[#7C766C] block">{row.user?.email || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => <StarRating rating={row.rating} size={12} />
    },
    { key: 'title', label: 'Title' },
    {
      key: 'comment',
      label: 'Comment',
      render: (row) => <span className="normal-case max-w-xs block truncate" title={row.comment}>{row.comment}</span>
    },
    {
      key: 'status',
      label: 'Moderation Status',
      render: (row) => (
        <span className={`px-2 py-0.5 font-display text-[8px] font-extrabold uppercase tracking-wider border select-none ${
          row.status === 'approved' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : row.status === 'rejected' 
            ? 'bg-red-50 text-red-800 border-red-200' 
            : 'bg-yellow-50 text-yellow-800 border-yellow-200'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Moderation actions',
      width: '200px',
      render: (row) => (
        <div className="flex gap-4 font-display text-[9px] font-extrabold uppercase tracking-widest">
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApprove(row._id)}
                className="text-emerald-700 hover:text-emerald-800 bg-transparent border-none cursor-pointer flex items-center gap-0.5"
              >
                <FiCheck size={12} />
                <span>APPROVE</span>
              </button>
              <button
                onClick={() => handleReject(row._id)}
                className="text-amber-700 hover:text-amber-800 bg-transparent border-none cursor-pointer flex items-center gap-0.5"
              >
                <FiX size={12} />
                <span>REJECT</span>
              </button>
            </>
          )}
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-700 hover:text-red-800 bg-transparent border-none cursor-pointer flex items-center gap-0.5"
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
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0A]">
          REVIEWS MODERATION
        </h1>
        <p className="font-body text-[10px] text-[#7C766C] tracking-widest mt-1">
          USER FEEDBACK CONTROL LOGS
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-[#D8D3CA] p-4 flex justify-between items-center">
        <span className="font-display text-[9px] font-extrabold text-[#7C766C]">Filter By Moderation State:</span>
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value)
            setCurrentPage(1)
          }}
          className="bg-transparent border-b border-[#D8D3CA] text-xs font-body tracking-wider focus:outline-none py-1 cursor-pointer font-extrabold"
        >
          <option value="">ALL REVIEWS</option>
          <option value="pending">PENDING</option>
          <option value="approved">APPROVED</option>
          <option value="rejected">REJECTED</option>
        </select>
      </div>

      {/* DataGrid */}
      <DataGrid
        columns={columns}
        items={reviews}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setCurrentPage}
        emptyMessage="No reviews logged in this state."
      />

    </div>
  )
}

export default AdminReviews
