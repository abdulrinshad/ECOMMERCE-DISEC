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
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import VerifyResetOTP from './pages/VerifyResetOTP'
import ResetPassword from './pages/ResetPassword'
import WishlistPage from './pages/WishlistPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetails from './pages/OrderDetails'
import ProductReviews from './pages/ProductReviews'
import CartPage from './pages/CartPage'

// Admin Panel Modules
import AdminLayout from './admin/layouts/AdminLayout'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminProducts from './admin/pages/AdminProducts'
import AdminOrders from './admin/pages/AdminOrders'
import AdminCustomers from './admin/pages/AdminCustomers'
import AdminReviews from './admin/pages/AdminReviews'
import AdminInventory from './admin/pages/AdminInventory'
import AdminSettings from './admin/pages/AdminSettings'
import AdminAuditLogs from './admin/pages/AdminAuditLogs'

// Auth Protection
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import CustomerRoute from './components/auth/CustomerRoute'
import Forbidden from './pages/Forbidden'
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
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className={isAdminPath ? "relative min-h-screen" : "relative min-h-screen bg-[#F2EFE9] text-[#0A0A0A] flex flex-col justify-between"}>
      {!isAdminPath && <Navbar />}
      
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
            path="/product/:productId/reviews"
            element={
              <PageTransition>
                <ProductReviews />
              </PageTransition>
            }
          />
          <Route
            path="/cart"
            element={
              <PageTransition>
                <CartPage />
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
          <Route
            path="/verify-email"
            element={
              <PageTransition>
                <VerifyEmail />
              </PageTransition>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageTransition>
                <ForgotPassword />
              </PageTransition>
            }
          />
          <Route
            path="/verify-reset-otp"
            element={
              <PageTransition>
                <VerifyResetOTP />
              </PageTransition>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PageTransition>
                <ResetPassword />
              </PageTransition>
            }
          />

          {/* Forbidden Page */}
          <Route
            path="/forbidden"
            element={
              <PageTransition>
                <Forbidden />
              </PageTransition>
            }
          />

          {/* Customer Routes */}
          <Route element={<CustomerRoute />}>
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
                  <OrdersPage />
                </PageTransition>
              }
            />
            <Route
              path="/orders"
              element={
                <PageTransition>
                  <OrdersPage />
                </PageTransition>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <PageTransition>
                  <OrderDetails />
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
              path="/wishlist"
              element={
                <PageTransition>
                  <WishlistPage />
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

          {/* Nested Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
            </Route>
          </Route>
        </Routes>
      </div>

      {!isAdminPath && <Footer />}
      
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
