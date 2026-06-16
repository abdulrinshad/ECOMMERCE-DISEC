import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register scroll trigger plugin
gsap.registerPlugin(ScrollTrigger)

export const useScrollReveal = (options = {}) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const children = Array.from(el.children)
    if (children.length === 0) return

    // Set initial state: opacity 0 and translateY 40px
    gsap.set(children, { opacity: 0, y: 40 })

    const ctx = gsap.context(() => {
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%', // trigger animation when top of element is 85% down viewport
          toggleActions: 'play none none none',
          ...options
        }
      })
    }, el)

    return () => ctx.revert()
  }, [options])

  return containerRef
}

export default useScrollReveal
