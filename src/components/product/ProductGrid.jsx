import PropTypes from 'prop-types'
import ProductCard from './ProductCard'

export const ProductGrid = ({ products = [], variant = 'standard' }) => {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center font-body text-xs uppercase tracking-widest text-[#5C5C5C]">
        No pieces found matching criteria.
      </div>
    )
  }

  if (variant === 'masonry') {
    // Split products into two columns (even and odd indexes) to simulate masonry layout
    const leftCol = products.filter((_, idx) => idx % 2 === 0)
    const rightCol = products.filter((_, idx) => idx % 2 !== 0)

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column (Taller images) */}
        <div className="flex flex-col gap-8">
          {leftCol.map((product) => (
            <div key={product.id} className="w-full">
              {/* Force taller aspect ratio on even items */}
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Column (Shorter/Standard images) */}
        <div className="flex flex-col gap-8 md:mt-12">
          {rightCol.map((product) => (
            <div key={product.id} className="w-full">
              {/* Force shorter aspect ratio on odd items */}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Standard 3-column grid for home Essentials section
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  variant: PropTypes.oneOf(['standard', 'masonry']),
}

export default ProductGrid
