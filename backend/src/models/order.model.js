import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
})

const trackingHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    items: [orderItemSchema],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address1: { type: String, required: true },
      address2: { type: String, default: '' },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'CARD'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
      index: true
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shippingFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    trackingHistory: [trackingHistorySchema],
    cancelReason: {
      type: String,
      default: ''
    },
    cancelledAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

export const Order = mongoose.model('Order', orderSchema)
export default Order
