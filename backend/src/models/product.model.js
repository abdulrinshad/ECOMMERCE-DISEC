import mongoose from 'mongoose'
import { slugify } from '../utils/slugify.js'
import { ALLOWED_CATEGORIES, ALLOWED_SIZES, ALLOWED_STATUSES } from '../constants/product.constants.js'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    shortDescription: {
      type: String,
      trim: true,
      default: ''
    },
    brand: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ALLOWED_CATEGORIES,
        message: '{VALUE} is not a supported category'
      },
      index: true
    },
    subCategory: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than 0'],
      index: true
    },
    compareAtPrice: {
      type: Number,
      default: null
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 1 && v.length <= 10
        },
        message: 'Product must have between 1 and 10 images'
      }
    },
    thumbnail: {
      type: String,
      trim: true,
      default: ''
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Stock must be an integer value'
      },
      default: 0
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true
    },
    isInStock: {
      type: Boolean,
      default: true
    },
    sizes: {
      type: [String],
      enum: {
        values: ALLOWED_SIZES,
        message: '{VALUE} is not a supported size'
      },
      default: []
    },
    colors: {
      type: [String],
      default: []
    },
    badge: {
      type: String,
      trim: true,
      default: ''
    },
    limitedCount: {
      type: Number,
      default: null
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      required: [true, 'Product status is required'],
      enum: {
        values: ALLOWED_STATUSES,
        message: '{VALUE} is not a supported status'
      },
      default: 'draft',
      index: true
    },
    metaTitle: {
      type: String,
      trim: true,
      default: ''
    },
    metaDescription: {
      type: String,
      trim: true,
      default: ''
    },
    averageRating: {
      type: Number,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    ratingDistribution: {
      type: Map,
      of: Number,
      default: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  },
  {
    timestamps: true
  }
)

// Pre-save hook to generate slug and synchronize isInStock
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name)
  }

  // Update stock status boolean automatically
  this.isInStock = this.stock > 0

  next()
})

export const Product = mongoose.model('Product', productSchema)
export default Product
