import React from 'react'

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-[#F2EFE9] z-50 select-none">
      <div className="space-y-4 text-center">
        {/* Pulsing Branded Logo */}
        <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-[0.2em] text-[#0A0A0A] animate-pulse">
          AVANT-GARDE
        </h1>
        <p className="font-body text-[9px] uppercase tracking-widest text-[#1A3C2E] font-medium">
          SECURE PROTOCOL INITIALIZING
        </p>
      </div>
    </div>
  )
}

export default LoadingScreen
