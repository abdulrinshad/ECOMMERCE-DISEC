import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSearch, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi'
import { useScrollNavbar } from '../../hooks/useScrollNavbar'
import { useCartStore } from '../../store/cartStore'

export const Navbar = () => {
  const isScrolled = useScrollNavbar(80)
  const location = useLocation()
  const { toggleDrawer, getCartCount } = useCartStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Decide if we should start transparent (only on Home page hero)
  const isHomePage = location.pathname === '/'
  const shouldBeTransparent = isHomePage && !isScrolled && !mobileMenuOpen

  const cartCount = getCartCount()

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          shouldBeTransparent
            ? 'bg-transparent border-transparent'
            : 'bg-white/95 backdrop-blur-md border-b border-[#D8D3CA]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className={`font-display text-xl font-bold tracking-[0.1em] transition-colors duration-300 ${
              shouldBeTransparent ? 'text-[#0A0A0A]' : 'text-[#0A0A0A]'
            }`}
          >
            AVANT-GARDE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              to="/"
              className="font-body text-xs font-medium uppercase tracking-[0.12em] text-[#0A0A0A] hover:text-[#5C5C5C] relative group"
            >
              Home
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#0A0A0A] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/shop"
              className="font-body text-xs font-medium uppercase tracking-[0.12em] text-[#0A0A0A] hover:text-[#5C5C5C] relative group"
            >
              Shop
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#0A0A0A] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="font-body text-xs font-medium uppercase tracking-[0.12em] text-[#0A0A0A] hover:text-[#5C5C5C] relative group"
            >
              About
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#0A0A0A] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/dashboard"
              className="font-body text-xs font-medium uppercase tracking-[0.12em] text-[#0A0A0A] hover:text-[#5C5C5C] relative group"
            >
              Account
              <span className="absolute left-0 bottom-[-4px] w-0 h-[1px] bg-[#0A0A0A] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-6">
            <button
              type="button"
              className="text-[#0A0A0A] hover:text-[#5C5C5C] transition-colors p-2"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>
            <button
              type="button"
              onClick={toggleDrawer}
              className="text-[#0A0A0A] hover:text-[#5C5C5C] transition-colors p-2 relative"
              aria-label="Shopping Cart"
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#1A3C2E] text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-body font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="md:hidden text-[#0A0A0A] hover:text-[#5C5C5C] transition-colors p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-[#F2EFE9] z-30 md:hidden flex flex-col justify-between p-8 border-t border-[#D8D3CA]">
          <div className="flex flex-col space-y-8 mt-8">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-3xl font-bold uppercase tracking-wider text-[#0A0A0A]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-3xl font-bold uppercase tracking-wider text-[#0A0A0A]"
            >
              Shop
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-3xl font-bold uppercase tracking-wider text-[#0A0A0A]"
            >
              About
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="font-display text-3xl font-bold uppercase tracking-wider text-[#0A0A0A]"
            >
              Account
            </Link>
          </div>
          <div className="border-t border-[#D8D3CA] pt-6 flex flex-col space-y-4">
            <span className="font-body text-[10px] uppercase tracking-widest text-[#5C5C5C]">
              AVANT-GARDE CO.
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
