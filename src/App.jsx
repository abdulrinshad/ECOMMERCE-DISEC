import { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import gsap from 'gsap'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CartDrawer from './components/layout/CartDrawer'

// Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Checkout from './pages/Checkout'

// Auth Protection
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoadingScreen from './components/ui/LoadingScreen'

// Scroll to Top on page change
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// Page Transition Wrapper
const PageTransition = ({ children }) => {
  const elementRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    // Page entrance animation
    gsap.set(el, {
      clipPath: 'inset(100% 0px 0px 0px)',
      opacity: 0,
      y: 40
    })

    gsap.to(el, {
      clipPath: 'inset(0% 0px 0px 0px)',
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.inOut'
    })
  }, [pathname])

  return (
    <div ref={elementRef} className="w-full min-h-screen">
      {children}
    </div>
  )
}

function AppContent() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="relative min-h-screen bg-[#F2EFE9] text-[#0A0A0A] flex flex-col justify-between">
      <Navbar />
      
      {/* Main Content Area with transitions */}
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/shop"
            element={
              <PageTransition>
                <Shop />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PageTransition>
                <ProductDetail />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            }
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              }
            />
            <Route
              path="/dashboard/orders"
              element={
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              }
            />
            <Route
              path="/dashboard/wishlist"
              element={
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              }
            />
            <Route
              path="/checkout"
              element={
                <PageTransition>
                  <Checkout />
                </PageTransition>
              }
            />
          </Route>
        </Routes>
      </div>

      <Footer />
      
      {/* Floating Cart Drawer overlay */}
      <CartDrawer />
      
      {/* Floating Toast notification container */}
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
