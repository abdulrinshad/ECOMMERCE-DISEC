import { useState, useEffect } from 'react'

export const useScrollNavbar = (threshold = 80) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Call on mount to handle initial load state
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  return isScrolled
}
export default useScrollNavbar
