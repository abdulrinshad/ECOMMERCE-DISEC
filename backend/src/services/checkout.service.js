import { Cart } from '../models/cart.model.js'
import { Product } from '../models/product.model.js'
import { Order } from '../models/order.model.js'
import { calculateShippingFee } from './shipping.service.js'
import { calculateTax } from './tax.service.js'
import { generateOrderNumber } from './order.service.js'
import { ApiError } from '../utils/ApiResponse.js'
import { sendOrderConfirmationEmail } from '../utils/sendEmail.js'

/**
 * Process order checkout
 * @param {string} userId 
 * @param {Object} checkoutData 
 * @returns {Promise<Object>}
 */
export const processCheckout = async (userId, checkoutData) => {
  const { email, keepUpdated, deliveryData, shippingMethod, paymentData, promoCode } = checkoutData

  // 1. Get active cart
  const cart = await Cart.findOne({ user: userId, status: 'active' }).populate('items.product')
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Your shopping cart is empty')
  }

  // 2. Validate product status and details
  const verifiedItems = []
  let calculatedSubtotal = 0

  for (const item of cart.items) {
    const product = item.product // Populated product document
    if (!product) {
      throw new ApiError(404, `Product '${item.name}' not found`)
    }

    // Validate product status (must be published/active/in-stock)
    if (product.status !== 'published') {
      throw new ApiError(400, `Product '${product.name}' is currently unavailable`)
    }

    // Validate size selection
    if (item.size && !product.sizes.includes(item.size)) {
      throw new ApiError(400, `Size '${item.size}' is not available for product '${product.name}'`)
    }

    // Validate color selection
    if (item.color && !product.colors.includes(item.color.toUpperCase())) {
      throw new ApiError(400, `Color '${item.color}' is not available for product '${product.name}'`)
    }

    // Check inventory
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for product '${product.name}'. Available: ${product.stock}`)
    }

    // Accumulate subtotal (using database pricing for security)
    const itemSubtotal = product.price * item.quantity
    calculatedSubtotal += itemSubtotal

    verifiedItems.push({
      product: product._id,
      productSnapshot: {
        name: product.name,
        price: product.price,
        description: product.description,
        thumbnail: product.thumbnail || (product.images && product.images[0]) || ''
      },
      variantId: `${product._id}_${item.size || 'default'}_${item.color || 'default'}`,
      sku: product.sku || '',
      name: product.name,
      image: product.thumbnail || (product.images && product.images[0]) || '',
      price: product.price,
      quantity: item.quantity,
      subtotal: itemSubtotal
    })
  }

  // 3. Recalculate totals server-side
  let discountPercent = 0
  if (promoCode) {
    const codeUpper = promoCode.toUpperCase()
    if (codeUpper === 'SAVE10' || codeUpper === 'DISCOUNT10') {
      discountPercent = 0.10
    } else if (codeUpper === 'SAVE20' || codeUpper === 'DISCOUNT20') {
      discountPercent = 0.20
    } else if (codeUpper === 'ARCHIVE') {
      discountPercent = 0.15
    }
  }

  const discountAmount = Number((calculatedSubtotal * discountPercent).toFixed(2))
  const discountedSubtotal = calculatedSubtotal - discountAmount
  const shippingFee = calculateShippingFee(shippingMethod)
  const tax = calculateTax(discountedSubtotal)
  const total = Number((discountedSubtotal + shippingFee + tax).toFixed(2))

  // 4. Deduct Stock atomically
  const deductedProducts = []
  try {
    for (const item of verifiedItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: { $gte: item.quantity }
        },
        {
          $inc: { stock: -item.quantity }
        },
        { new: true }
      )

      if (!updatedProduct) {
        throw new ApiError(400, `Insufficient stock for product '${item.name}' during processing`)
      }

      deductedProducts.push({
        product: item.product,
        quantity: item.quantity
      })
    }
  } catch (error) {
    // Rollback stock deduction for already processed products
    for (const roll of deductedProducts) {
      await Product.findByIdAndUpdate(roll.product, {
        $inc: { stock: roll.quantity }
      })
    }
    throw error
  }

  // 5. Create Order
  const orderNumber = generateOrderNumber()
  const order = await Order.create({
    orderNumber,
    user: userId,
    items: verifiedItems,
    customer: {
      email
    },
    shippingAddress: {
      firstName: deliveryData.firstName,
      lastName: deliveryData.lastName,
      address1: deliveryData.address1,
      address2: deliveryData.address2 || '',
      city: deliveryData.city,
      postalCode: deliveryData.postalCode,
      country: deliveryData.country
    },
    pricing: {
      subtotal: calculatedSubtotal,
      discount: discountAmount,
      shippingFee,
      tax,
      grandTotal: total
    },
    status: 'confirmed',
    paymentStatus: 'paid', // Simulated payment success
    trackingHistory: [
      {
        status: 'pending',
        message: 'Order protocol initialized. Acquisition requested.'
      },
      {
        status: 'confirmed',
        message: 'Payment completed successfully. Order confirmed.'
      }
    ],
    estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  })

  // 6. Convert cart and clear items
  cart.status = 'converted'
  cart.items = []
  await cart.save()

  // 7. Dispatch Confirmation Email
  // Run asynchronously without blocking response
  sendOrderConfirmationEmail(email, deliveryData.firstName, {
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    items: order.items,
    amounts: {
      subtotal: order.pricing.subtotal,
      discount: order.pricing.discount,
      shippingFee: order.pricing.shippingFee,
      tax: order.pricing.tax,
      total: order.pricing.grandTotal
    },
    shippingAddress: {
      line1: order.shippingAddress.address1,
      line2: order.shippingAddress.address2 || '',
      city: order.shippingAddress.city,
      postalCode: order.shippingAddress.postalCode,
      country: order.shippingAddress.country
    }
  }).catch((err) => {
    console.error('Failed to send confirmation email:', err)
  })

  return order
}
