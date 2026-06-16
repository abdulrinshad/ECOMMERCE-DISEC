import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Badge from '../ui/Badge'

export const ProductCard = ({ product }) => {
  const { id, name, price, series, badge, images } = product

  return (
    <Link
      to={`/product/${id}`}
      className="group block bg-white border border-[#D8D3CA] overflow-hidden transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-[6px] hover:shadow-[0_12px_24px_rgba(26,60,46,0.08)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#E8E4DC]">
        {/* Product Image */}
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-[400ms] group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Top-Right Badges */}
        {badge && (
          <div className="absolute top-4 right-4 z-10">
            <Badge>{badge}</Badge>
          </div>
        )}

        {/* Bottom-Left Price Badge overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-white px-3 py-1.5 shadow-sm border border-[#D8D3CA]">
          <span className="font-body text-xs font-semibold text-[#0A0A0A]">
            ${price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Details below card */}
      <div className="p-5 border-t border-[#D8D3CA]">
        <span className="font-body text-[9px] uppercase tracking-widest text-text-secondary">
          {series}
        </span>
        <h3 className="font-display text-sm font-bold uppercase tracking-tight text-[#0A0A0A] mt-1 leading-tight group-hover:text-accent transition-colors">
          {name}
        </h3>
      </div>
    </Link>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    series: PropTypes.string.isRequired,
    badge: PropTypes.string,
    sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
}

export default ProductCard
