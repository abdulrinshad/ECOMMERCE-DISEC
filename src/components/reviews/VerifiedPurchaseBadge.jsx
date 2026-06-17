import React from 'react'

export const VerifiedPurchaseBadge = () => {
  return (
    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 font-display text-[8px] font-extrabold uppercase tracking-widest select-none">
      ✓ Verified Purchase
    </span>
  )
}

export default React.memo(VerifiedPurchaseBadge)
