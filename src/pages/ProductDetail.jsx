import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { useCartStore } from '../store/cartStore'
import SizePicker from '../components/ui/SizePicker'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { useScrollReveal } from '../hooks/useScrollReveal'

export const ProductDetail = () => {
  const { id } = useParams()
  const { addItem, openDrawer } = useCartStore()
  
  const revealRef = useScrollReveal()

  // Find current product
  const product = useMemo(() => {
    return products.find((p) => p.id === id) || products[0]
  }, [id])

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M')
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'CARBON BLACK')

  // Get 3 related items (different from current)
  const relatedPieces = useMemo(() => {
    return products.filter((p) => p.id !== product.id).slice(0, 3)
  }, [product.id])

  const handleAddToBag = () => {
    addItem(product, selectedSize, selectedColor)
    // Custom toast notification
    toast.success(`${product.name} [SIZE ${selectedSize}] ADDED TO BAG`, {
      style: {
        border: '1px solid #1A3C2E',
        padding: '16px',
        color: '#0A0A0A',
        background: '#F2EFE9',
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        letterSpacing: '0.1em',
        borderRadius: '0px',
      },
      iconTheme: {
        primary: '#1A3C2E',
        secondary: '#F2EFE9',
      },
    })
    
    // Automatically reveal the drawer for a premium responsive UX
    setTimeout(() => {
      openDrawer()
    }, 450)
  }

  return (
    <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 bg-bg-base">
      {/* Back to shop link */}
      <div className="mb-8">
        <Link
          to="/shop"
          className="font-body text-xs font-semibold uppercase tracking-widest text-text-secondary hover:text-[#0A0A0A] transition-colors inline-flex items-center gap-2"
        >
          ← BACK TO ARCHIVES
        </Link>
      </div>

      {/* 60% Left / 40% Right Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column (60% width) - Vertical scroll of 3 images */}
        <div className="lg:col-span-7 space-y-6">
          {product.images.map((image, index) => (
            <div
              key={index}
              className="w-full aspect-[3/4] bg-bg-surface overflow-hidden border border-[#D8D3CA]"
            >
              <img
                src={image}
                alt={`${product.name} detail view ${index + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* Right Column (40% width) - Sticky panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-10">
          <div>
            <span className="font-body text-xs font-medium uppercase tracking-[0.12em] text-[#5C5C5C]">
              {product.series}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#0A0A0A] mt-2 leading-tight">
              {product.name}
            </h1>
          </div>

          <p className="font-body text-sm font-light text-text-secondary leading-relaxed tracking-wide">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors.length > 1 && (
            <div className="space-y-3">
              <span className="font-body text-[10px] font-semibold uppercase tracking-widest text-text-secondary block">
                SELECT COLOR
              </span>
              <div className="flex gap-4">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`font-body text-xs font-medium uppercase tracking-wider py-1 border-b ${
                      selectedColor === color
                        ? 'border-[#1A3C2E] text-[#0A0A0A]'
                        : 'border-transparent text-text-secondary hover:text-[#0A0A0A]'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="space-y-4">
            <span className="font-body text-[10px] font-semibold uppercase tracking-widest text-text-secondary block">
              SELECT SIZE
            </span>
            <SizePicker
              sizes={product.sizes}
              selectedSize={selectedSize}
              onChange={setSelectedSize}
            />
          </div>

          {/* Price & Checkout Option */}
          <div className="border-t border-[#D8D3CA] pt-8 space-y-6">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-extrabold text-[#0A0A0A]">
                  ${product.price.toLocaleString()}
                </span>
                <span className="font-body text-[10px] uppercase tracking-widest text-[#5C5C5C]">
                  VAT INCLUDED
                </span>
              </div>
            </div>

            <Button
              variant="solid"
              onClick={handleAddToBag}
              shouldFlash={true}
              className="w-full py-4 font-display text-sm tracking-[0.2em]"
            >
              ADD TO BAG
            </Button>

            <p className="font-body text-[10px] uppercase tracking-widest text-[#5C5C5C] text-center">
              Limited Edition Drop / {product.limitedCount} Pieces Only
            </p>
          </div>
        </div>
      </div>

      {/* Related Pieces section */}
      <section ref={revealRef} className="mt-32 pt-20 border-t border-[#D8D3CA] space-y-12">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-widest text-[#0A0A0A]">
            RELATED PIECES
          </h2>
          <div className="flex space-x-4">
            <button
              type="button"
              className="p-2 border border-[#D8D3CA] hover:border-[#1A3C2E] transition-colors"
              aria-label="Previous Page"
            >
              <FiArrowLeft size={16} />
            </button>
            <button
              type="button"
              className="p-2 border border-[#D8D3CA] hover:border-[#1A3C2E] transition-colors"
              aria-label="Next Page"
            >
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal scroll grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedPieces.map((piece) => (
            <div key={piece.id} className="relative">
              {/* Force related cards to show a custom badge */}
              <Link
                to={`/product/${piece.id}`}
                className="group block bg-white border border-[#D8D3CA] overflow-hidden transition-all duration-200 hover:-translate-y-[4px] hover:shadow-md"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-bg-surface">
                  <img
                    src={piece.images[0]}
                    alt={piece.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <Badge>NEW ARRIVAL</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 z-10 bg-white px-2.5 py-1.5 border border-[#D8D3CA]">
                    <span className="font-body text-xs font-semibold text-[#0A0A0A]">
                      ${piece.price.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="p-4 border-t border-[#D8D3CA]">
                  <span className="font-body text-[9px] uppercase tracking-widest text-[#5C5C5C]">
                    {piece.series}
                  </span>
                  <h3 className="font-display text-xs font-bold uppercase tracking-tight text-[#0A0A0A] mt-1 group-hover:text-accent">
                    {piece.name}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ProductDetail
