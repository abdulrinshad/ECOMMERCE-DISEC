import { useState, useMemo } from 'react'
import { products } from '../data/products'
import ProductGrid from '../components/product/ProductGrid'
import Button from '../components/ui/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'

export const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedSize, setSelectedSize] = useState('ALL')
  const [selectedColor, setSelectedColor] = useState('ALL')
  const [sortOption, setSortOption] = useState('LATEST')

  const revealRef = useScrollReveal()

  // Sidebar options
  const categories = ['ALL', 'Outerwear', 'Tops', 'Bottoms', 'Footwear', 'Accessories']
  const sizes = ['ALL', 'S', 'M', 'L', 'XL', 'O/S']
  const colors = ['ALL', 'CARBON BLACK', 'STEALTH BLACK', 'CHROME', 'MATTE BLACK', 'FROST GRAY', 'ALPHA GREEN', 'CORE OLIVE', 'DARK CREAM']

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Category Filter
    if (selectedCategory !== 'ALL') {
      result = result.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Size Filter
    if (selectedSize !== 'ALL') {
      result = result.filter(p => p.sizes.includes(selectedSize))
    }

    // Color Filter
    if (selectedColor !== 'ALL') {
      result = result.filter(p => p.colors.includes(selectedColor))
    }

    // Sorting
    if (sortOption === 'PRICE: LOW') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption === 'POPULARITY') {
      // Sort items marked as SOLD OUT or LIMITED first as high popularity items
      result.sort((a, b) => {
        const scoreA = a.badge === 'SOLD OUT' ? 3 : a.badge === 'LIMITED' ? 2 : 1
        const scoreB = b.badge === 'SOLD OUT' ? 3 : b.badge === 'LIMITED' ? 2 : 1
        return scoreB - scoreA
      })
    } else {
      // LATEST (default) - Keep original mock order or sort by limitedCount
      result.sort((a, b) => b.limitedCount - a.limitedCount)
    }

    return result
  }, [selectedCategory, selectedSize, selectedColor, sortOption])

  return (
    <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 min-h-screen bg-bg-base">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-12 gap-6 border-b border-[#D8D3CA] pb-6">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
          ARCHIVES 2024
        </h1>

        {/* Sort Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-body text-[10px] uppercase tracking-widest text-text-secondary mr-2">
            SORT BY:
          </span>
          {['LATEST', 'POPULARITY', 'PRICE: LOW'].map((option) => {
            const isActive = sortOption === option
            return (
              <button
                key={option}
                onClick={() => setSortOption(option)}
                className={`
                  px-4 py-1.5 font-body text-[10px] font-medium tracking-widest border transition-all duration-150
                  ${
                    isActive
                      ? 'bg-[#1A3C2E] border-[#1A3C2E] text-white'
                      : 'bg-transparent border-[#D8D3CA] text-[#0A0A0A] hover:border-[#1A3C2E]'
                  }
                `}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div ref={revealRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Fixed Left Sidebar (on desktop) */}
        <aside className="lg:col-span-3 space-y-10 lg:sticky lg:top-28">
          {/* Categories */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-[#0A0A0A] mb-4 border-b border-[#D8D3CA] pb-2">
              CATEGORY
            </h3>
            <ul className="space-y-3 font-body text-xs uppercase tracking-widest">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat
                return (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`hover:text-[#0A0A0A] transition-colors relative pb-1 ${
                        isActive ? 'text-[#0A0A0A] font-medium' : 'text-text-secondary'
                      }`}
                    >
                      {cat}
                      {isActive && (
                        <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#1A3C2E]"></span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-[#0A0A0A] mb-4 border-b border-[#D8D3CA] pb-2">
              SIZE
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz) => {
                const isActive = selectedSize === sz
                return (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`
                      px-3 py-2 border font-body text-[10px] font-medium tracking-wider min-w-[36px] transition-all duration-150
                      ${
                        isActive
                          ? 'bg-[#1A3C2E] border-[#1A3C2E] text-white scale-105'
                          : 'bg-transparent border-[#D8D3CA] text-text-secondary hover:border-[#1A3C2E] hover:text-[#0A0A0A]'
                      }
                    `}
                  >
                    {sz}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-[#0A0A0A] mb-4 border-b border-[#D8D3CA] pb-2">
              COLOR
            </h3>
            <ul className="space-y-3 font-body text-xs uppercase tracking-widest">
              {colors.map((col) => {
                const isActive = selectedColor === col
                return (
                  <li key={col}>
                    <button
                      onClick={() => setSelectedColor(col)}
                      className={`hover:text-[#0A0A0A] transition-colors ${
                        isActive ? 'text-[#0A0A0A] font-semibold underline' : 'text-text-secondary'
                      }`}
                    >
                      {col}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* Right Main Grid */}
        <section className="lg:col-span-9">
          <ProductGrid products={filteredProducts} variant="masonry" />
        </section>
      </div>
    </main>
  )
}

export default Shop
