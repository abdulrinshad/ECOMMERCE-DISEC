import React, { useState } from 'react'
import toast from 'react-hot-toast'

export const AdminSettings = () => {
  const [storeName, setStoreName] = useState('AVANT-GARDE ONLINE ARCHIVES')
  const [taxRate, setTaxRate] = useState(20) // 20% VAT
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('STORE REGISTRY SETTINGS SAVED')
    }, 800)
  }

  return (
    <div className="space-y-8 uppercase max-w-lg">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0A]">
          SYSTEM CONFIGURATION
        </h1>
        <p className="font-body text-[10px] text-[#7C766C] tracking-widest mt-1">
          STORE PROFILE & OPERATIONAL CONSTANTS
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-[#D8D3CA] p-6 space-y-6">
        
        {/* Store Name */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Store Public Identity Name *
          </label>
          <input
            type="text"
            required
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
          />
        </div>

        {/* Tax (VAT) Rate */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            System Tax Rate / VAT (%) *
          </label>
          <input
            type="number"
            required
            min="0"
            max="100"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none text-[#0A0A0A]"
          />
        </div>

        {/* Shipping settings */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Default Standard Logistics Partner
          </label>
          <select
            value={shippingMethod}
            onChange={(e) => setShippingMethod(e.target.value)}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A] cursor-pointer"
          >
            <option value="standard">STANDARD FULFILLMENT</option>
            <option value="express">EXPRESS COURIER PROTOCOL</option>
          </select>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-[#D8D3CA]">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#1A3C2E] hover:bg-[#2D6B4F] text-white py-4 font-display text-[10px] font-extrabold uppercase tracking-widest border-none transition-transform active:scale-[0.98] cursor-pointer"
          >
            {isSaving ? 'SAVING CONFIGURATION...' : 'SAVE CONFIGURATION'}
          </button>
        </div>

      </form>

    </div>
  )
}

export default AdminSettings
