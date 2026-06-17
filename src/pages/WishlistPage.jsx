import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWishlistStore } from '../store/wishlistStore'
import { useAuth } from '../context/AuthContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import toast from 'react-hot-toast'

export const WishlistPage = () => {
  const { accessToken } = useAuth()
  const { items, isLoading, fetchWishlist, removeFromWishlist, moveToCart } = useWishlistStore()
  const revealRef = useScrollReveal()

  useEffect(() => {
    if (accessToken) {
      fetchWishlist(accessToken)
    }
  }, [accessToken, fetchWishlist])

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(accessToken, productId)
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleMoveToBag = async (productId) => {
    try {
      // Defaulting to empty size/color, assuming backend/cart handles it
      // For a truly robust system we might want a modal here to select size if not already selected.
      await moveToCart(accessToken, productId, '', '')
      toast.success('Moved to bag')
    } catch (error) {
      toast.error(error.message || 'Failed to move to bag')
    }
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2EFE9]">
        <div className="w-8 h-8 border-4 border-[#1A3C2E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 min-h-screen bg-[#F2EFE9]">
      <div className="mb-16 text-center lg:text-left border-b border-[#D8D3CA] pb-6">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
          WISHLIST
        </h1>
        <p className="font-body text-xs uppercase tracking-widest text-[#595959] mt-4">
          Saved Pieces <span className="text-[#0A0A0A] font-semibold ml-2">({items.length})</span>
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="font-display text-2xl font-bold uppercase text-[#0A0A0A] mb-4">
            YOUR WISHLIST IS EMPTY
          </h2>
          <p className="font-body text-sm text-[#595959] max-w-md mx-auto mb-10">
            Continue exploring our collections to discover new pieces to add to your personal archive.
          </p>
          <Link
            to="/shop"
            className="px-8 py-4 bg-[#0A0A0A] text-[#F2EFE9] font-body text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#1A3C2E] transition-colors duration-300"
          >
            RETURN TO ARCHIVES
          </Link>
        </div>
      ) : (
        <div 
          ref={revealRef} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {items.map((item) => {
            const snap = item.productSnapshot
            return (
              <div key={item.product} className="flex flex-col group">
                <div className="relative aspect-[3/4] bg-[#EAE6DF] mb-6 overflow-hidden">
                  <Link to={`/shop/${snap.slug}`}>
                    <img
                      src={snap.image || '/placeholder-image.jpg'}
                      alt={snap.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  {snap.badge && (
                    <div className="absolute top-4 left-4 bg-[#0A0A0A] text-[#F2EFE9] px-3 py-1 font-body text-[10px] font-bold uppercase tracking-widest z-10">
                      {snap.badge}
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-grow">
                  <p className="font-body text-xs text-[#595959] uppercase tracking-widest mb-1">
                    {snap.badge || 'Archive'}
                  </p>
                  <Link to={`/shop/${snap.slug}`} className="hover:opacity-70 transition-opacity">
                    <h3 className="font-display text-lg font-bold text-[#0A0A0A] uppercase leading-tight mb-2 line-clamp-1">
                      {snap.name}
                    </h3>
                  </Link>
                  <p className="font-body text-sm text-[#0A0A0A] font-medium tracking-wide mb-6">
                    ${snap.price.toFixed(2)}
                  </p>

                  <div className="mt-auto space-y-3">
                    <button
                      onClick={() => handleMoveToBag(item.product)}
                      className="w-full py-3 bg-[#0A0A0A] text-[#F2EFE9] font-body text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1A3C2E] transition-colors duration-300 border border-[#0A0A0A]"
                    >
                      MOVE TO BAG
                    </button>
                    <div className="flex gap-3">
                      <Link
                        to={`/shop/${snap.slug}`}
                        className="flex-1 text-center py-3 bg-transparent text-[#0A0A0A] font-body text-[10px] font-bold uppercase tracking-[0.2em] border border-[#D8D3CA] hover:border-[#0A0A0A] transition-colors duration-300"
                      >
                        VIEW PRODUCT
                      </Link>
                      <button
                        onClick={() => handleRemove(item.product)}
                        className="flex-1 py-3 bg-transparent text-[#0A0A0A] font-body text-[10px] font-bold uppercase tracking-[0.2em] border border-[#D8D3CA] hover:border-red-900 hover:text-red-900 transition-colors duration-300"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default WishlistPage
