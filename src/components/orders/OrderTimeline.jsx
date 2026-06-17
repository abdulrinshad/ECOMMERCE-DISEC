import React from 'react'

export const OrderTimeline = ({ status }) => {
  const steps = [
    { key: 'pending', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'out_for_delivery', label: 'Out For Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ]

  const statusLower = (status || '').toLowerCase()

  // Find index of current status
  const currentStepIndex = steps.findIndex((step) => step.key === statusLower)

  // If status is cancelled or refunded, we'll display a notification banner instead of normal delivery progress
  if (['cancelled', 'refunded'].includes(statusLower)) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 text-center">
        <h3 className="font-display text-sm font-extrabold tracking-wider text-red-800 uppercase">
          PROTOCOL INACTIVE
        </h3>
        <p className="font-body text-xs text-red-700 mt-2 uppercase tracking-wide">
          This order has been {statusLower}. No tracking protocol is active.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full py-8">
      {/* Visual Timeline Wrapper */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0">
        
        {/* Connection Line (Desktop) */}
        <div className="hidden md:block absolute top-[18px] left-[5%] right-[5%] h-[2px] bg-[#D8D3CA] -z-1" />
        <div 
          className="hidden md:block absolute top-[18px] left-[5%] h-[2px] bg-[#1A3C2E] -z-1 transition-all duration-700 ease-in-out" 
          style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 90 : 0}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex
          const isCurrent = idx === currentStepIndex

          return (
            <div 
              key={step.key} 
              className="flex md:flex-col items-center gap-4 md:gap-3 flex-1 text-left md:text-center relative z-10"
            >
              {/* Circle Marker */}
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 font-display text-xs font-black ${
                  isCompleted 
                    ? 'bg-[#1A3C2E] border-[#1A3C2E] text-white' 
                    : 'bg-[#F2EFE9] border-[#D8D3CA] text-[#7C766C]'
                } ${isCurrent ? 'ring-4 ring-[#1A3C2E]/20 scale-110' : ''}`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>

              {/* Step Label */}
              <div>
                <span 
                  className={`block font-display text-[10px] font-extrabold uppercase tracking-widest ${
                    isCompleted ? 'text-[#0A0A0A]' : 'text-[#7C766C]'
                  } ${isCurrent ? 'text-[#1A3C2E]' : ''}`}
                >
                  {step.label}
                </span>
                {isCurrent && (
                  <span className="block text-[8px] text-[#1A3C2E] font-body font-bold uppercase tracking-wider mt-0.5">
                    CURRENT STATE
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(OrderTimeline)
