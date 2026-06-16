import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  cartItems: [],
  isDrawerOpen: false,
  
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  
  addItem: (product, size, color) => {
    set((state) => {
      // Find if item with same ID, size, and color already exists
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      )
      
      let newCartItems = [...state.cartItems]
      
      if (existingItemIndex > -1) {
        // Increment quantity
        newCartItems[existingItemIndex] = {
          ...newCartItems[existingItemIndex],
          quantity: newCartItems[existingItemIndex].quantity + 1
        }
      } else {
        // Add new item
        newCartItems.push({
          ...product,
          selectedSize: size,
          selectedColor: color,
          quantity: 1
        })
      }
      
      return { cartItems: newCartItems }
    })
  },
  
  removeItem: (itemId, size, color) => {
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => !(item.id === itemId && item.selectedSize === size && item.selectedColor === color)
      )
    }))
  },
  
  updateQuantity: (itemId, size, color, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId, size, color)
      return
    }
    
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === itemId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    }))
  },
  
  clearCart: () => set({ cartItems: [] }),
  
  getCartTotal: () => {
    const { cartItems } = get()
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  },
  
  getCartCount: () => {
    const { cartItems } = get()
    return cartItems.reduce((acc, item) => acc + item.quantity, 0)
  }
}))
