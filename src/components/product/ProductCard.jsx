import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge'
import { useWishlistStore } from '../../store/wishlistStore'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export const ProductCard = ({ product }) => {
  const id = product._id || product.id
  const { name, price, series, badge, images, slug } = product
  const { accessToken } = useAuth()
  const { items, toggleWishlist } = useWishlistStore()
  const navigate = useNavigate()

  const isWishlisted = items.some(item => item.product === id)

  const handleWishlistClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!accessToken) {
      toast('Please login to save items', { icon: '🔒' })
      navigate('/login')
      return
    }

    try {
      const productSnapshot = {
        name,
        slug: slug || name.toLowerCase().replace(/ /g, '-'),
        image: images[0],
        price,
        badge: badge || ''
      }
      
      const added = await toggleWishlist(accessToken, id, productSnapshot)
      if (added) {
        toast.success('Added to wishlist')
      } else {
        toast.success('Removed from wishlist')
      }
    } catch (error) {
      toast.error('Failed to update wishlist')
    }
  }

  return (
    <Link
      to={`/product/${slug || id}`}
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

        {/* Top-Left Badges */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <Badge>{badge}</Badge>
          </div>
        )}

        {/* Top-Right Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm border border-[#D8D3CA] rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-sm"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={isWishlisted ? "#1A3C2E" : "none"}
            stroke={isWishlisted ? "#1A3C2E" : "#0A0A0A"}
            strokeWidth="1.5" 
            className="w-4 h-4 transition-colors"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

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
