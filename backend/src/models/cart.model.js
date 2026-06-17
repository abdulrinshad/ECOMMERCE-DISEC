import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required']
    },
    productSnapshot: {
      name: { type: String, required: true },
      image: { type: String, default: '' },
      price: { type: Number, required: true },
      sku: { type: String, default: '' }
    },
    sku: { type: String, default: '' },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    size: { type: String, default: '' },
    color: { type: String, default: '' },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      max: [10, 'Quantity cannot exceed 10'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer'
      }
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { _id: true }
)

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    items: [cartItemSchema],
    cartSummary: {
      totalItems: { type: Number, default: 0 },
      subtotal: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      grandTotal: { type: Number, default: 0 }
    },
    status: {
      type: String,
      enum: ['active', 'converted', 'abandoned'],
      default: 'active',
      index: true
    }
  },
  {
    timestamps: true
  }
)

cartSchema.index(
  { user: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'active' } }
)

// Pre-save middleware to recalculate subtotals, item count, and summary grand totals
cartSchema.pre('save', function (next) {
  let totalItems = 0
  let subtotal = 0

  // Calculate subtotals for each item and accumulate cart totals
  this.items.forEach((item) => {
    item.subtotal = item.price * item.quantity
    totalItems += item.quantity
    subtotal += item.subtotal
  })

  this.cartSummary.totalItems = totalItems
  this.cartSummary.subtotal = subtotal

  // Grand total formula: subtotal - discount + tax + shipping
  const discount = this.cartSummary.discount || 0
  const tax = this.cartSummary.tax || 0
  const shipping = this.cartSummary.shipping || 0

  // Keep grandTotal non-negative
  this.cartSummary.grandTotal = Math.max(0, subtotal - discount + tax + shipping)

  next()
})

export const Cart = mongoose.model('Cart', cartSchema)
export default Cart
