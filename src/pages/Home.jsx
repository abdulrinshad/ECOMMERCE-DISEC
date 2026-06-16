import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { products } from '../data/products'
import ProductGrid from '../components/product/ProductGrid'
import Ticker from '../components/ui/Ticker'
import Button from '../components/ui/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'

export const Home = () => {
  const heroRef = useRef(null)
  
  // Stagger reveal on scroll for other sections
  const essentialsRevealRef = useScrollReveal()
  const statementRevealRef = useScrollReveal()
  const seriesRevealRef = useScrollReveal()
  const newsletterRevealRef = useScrollReveal()

  // Hero entrance animation
  useGSAP(() => {
    const timer = setTimeout(() => {
      const words = heroRef.current.querySelectorAll('.hero-word')
      gsap.from(words, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      })
    }, 200)

    return () => clearTimeout(timer)
  }, { scope: heroRef })

  // Filter 3 essentials products
  const essentialsProducts = products.slice(0, 3)

  return (
    <main className="w-full overflow-hidden">
      {/* 1. HERO SECTION */}
      <section
        ref={heroRef}
        className="w-full min-h-screen pt-20 flex flex-col md:flex-row relative bg-bg-base"
      >
        {/* Left Panel */}
        <div className="flex-1 flex flex-col justify-between p-6 md:p-12 z-10 md:max-w-[65%]">
          <div className="mt-12 md:mt-24">
            <h1 className="font-display text-[clamp(64px,9vw,130px)] font-extrabold uppercase leading-[0.85] tracking-tighter text-[#0A0A0A] whitespace-pre-line select-none max-w-full truncate md:overflow-visible">
              <span className="hero-word inline-block mr-4">AVANT-</span>
              <br />
              <span className="hero-word inline-block mr-4">GARDE</span>
              <br />
              <span className="hero-word inline-block mr-4">ARCHIVES</span>
            </h1>
          </div>

          <div className="mt-12 md:mt-0 max-w-md space-y-6">
            <p className="font-body text-xs text-text-secondary leading-relaxed tracking-wide uppercase">
              A physical archive examining garment silhouettes, functional construction, and technical materiality. Made in limited quantities.
            </p>
            <Link to="/shop">
              <Button variant="solid" className="px-8 py-4 text-xs font-semibold tracking-[0.15em]">
                ENTER ARCHIVE
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Panel - Editorial Image */}
        <div className="w-full md:w-[45%] h-[60vh] md:h-screen md:absolute md:top-0 md:right-0 bg-bg-surface overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
            alt="Editorial Avant Garde Silhouette"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* 2. TICKER BANNER */}
      <Ticker />

      {/* 3. THE ESSENTIALS SECTION */}
      <section
        ref={essentialsRevealRef}
        className="max-w-7xl mx-auto px-6 py-28"
      >
        <div className="flex justify-between items-baseline mb-12 border-b border-[#D8D3CA] pb-4">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-widest text-[#0A0A0A]">
            THE ESSENTIALS
          </h2>
          <Link
            to="/shop"
            className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-[#0A0A0A] hover:text-[#5C5C5C] transition-colors"
          >
            VIEW ALL →
          </Link>
        </div>

        <ProductGrid products={essentialsProducts} variant="standard" />
      </section>

      {/* 4. EDITORIAL STATEMENT */}
      <section
        ref={statementRevealRef}
        className="w-full bg-[#E8E4DC] py-40 px-6 border-y border-[#D8D3CA]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-3xl md:text-6xl font-extrabold uppercase tracking-tighter leading-none text-[#0A0A0A] max-w-5xl">
            “WE DO NOT CREATE TRENDS. WE DOCUMENT THE EVOLUTION OF FORM.”
          </h2>
          <div className="flex justify-end mt-12">
            <p className="font-body text-xs text-text-secondary max-w-md leading-relaxed tracking-wider uppercase">
              Form follows protection. Utility structures the visual code. In an era of rapid obsolescence, we specialize in technical longevity and architectural design.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SERIES SECTION */}
      <section
        ref={seriesRevealRef}
        className="max-w-7xl mx-auto px-6 py-28"
      >
        <div className="mb-12 border-b border-[#D8D3CA] pb-4">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-widest text-[#0A0A0A]">
            SERIES 044: STATIC
          </h2>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Left panel (Large Image) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="aspect-[4/5] bg-bg-surface overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"
                alt="Construction Silhouette"
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="font-body text-[10px] uppercase tracking-widest text-text-secondary mt-4 block">
              01 / CONSTRUCTION
            </span>
          </div>

          {/* Right panel (2 stacked smaller images) */}
          <div className="md:col-span-5 flex flex-col justify-between gap-12 md:gap-8">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="aspect-[4/3] bg-bg-surface overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop"
                    alt="Structure Silhouette"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="font-body text-[10px] uppercase tracking-widest text-text-secondary mt-4 block">
                  02 / STRUCTURE
                </span>
              </div>
              
              <div className="mt-8 md:mt-0">
                <div className="aspect-[4/3] bg-bg-surface overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop"
                    alt="Fluidity Silhouette"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="font-body text-[10px] uppercase tracking-widest text-text-secondary mt-4 block">
                  03 / FLUIDITY
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER / CTA SECTION */}
      <section
        ref={newsletterRevealRef}
        className="w-full bg-[#E8E4DC] border-t border-[#D8D3CA] py-32 px-6 text-center"
      >
        <div className="max-w-xl mx-auto space-y-10">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tighter text-[#0A0A0A]">
            JOIN THE COLLECTIVE
          </h2>
          <p className="font-body text-xs text-text-secondary uppercase tracking-widest">
            SUBSCRIBE FOR FIRST NOTIFICATION OF NEW Drop Series 045.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              alert('ACCESS IDENTITY ACQUIRED')
            }}
            className="flex flex-col space-y-6"
          >
            <input
              type="email"
              required
              placeholder="ENTER EMAIL ADDRESS"
              className="bg-transparent border-b border-[#0A0A0A] py-3 text-center text-xs font-body tracking-[0.15em] placeholder-text-secondary/50 focus:outline-none focus:border-[#1A3C2E] uppercase text-[#0A0A0A]"
            />
            <Button
              type="submit"
              variant="solid"
              className="w-full py-4 tracking-widest text-xs"
            >
              ACCESS ARCHIVE
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Home
