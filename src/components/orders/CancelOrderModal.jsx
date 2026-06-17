import React, { useState } from 'react'

export const CancelOrderModal = ({ isOpen, onClose, onConfirm, isProcessing }) => {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('Please provide a valid cancellation protocol reason.')
      return
    }
    if (reason.trim().length < 5) {
      setError('Reason must be at least 5 characters long.')
      return
    }
    setError('')
    onConfirm(reason)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Backdrop Overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-[#0A0A0A]/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Dialog Content Container */}
      <div className="relative bg-[#F2EFE9] border border-[#D8D3CA] w-full max-w-md p-8 shadow-xl animate-fade-in z-10">
        <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
          CANCEL ACQUISITION PROTOCOL
        </h2>
        <p className="font-body text-xs text-[#5C5C5C] mt-2 uppercase tracking-wide">
          Are you sure you want to terminate this order acquisition? This action will immediately release and restore product inventory.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
              REASON FOR CANCELLATION *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (e.target.value.trim().length >= 5) setError('')
              }}
              className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
              placeholder="E.G. DUPLICATE ORDER / MISTAKEN QUANTITY"
            />
            {error && (
              <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block">
                {error}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 bg-transparent hover:bg-neutral-100 text-[#0A0A0A] border border-[#D8D3CA] py-3 font-display text-[10px] font-bold uppercase tracking-widest transition-colors duration-200"
            >
              KEEP ORDER
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-red-700 hover:bg-red-800 text-white border-none py-3 font-display text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 active:scale-[0.98]"
            >
              {isProcessing ? 'TERMINATING...' : 'CONFIRM CANCEL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default React.memo(CancelOrderModal)
