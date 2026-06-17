import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true // One wishlist per user
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        productSnapshot: {
          name: {
            type: String,
            required: true
          },
          slug: {
            type: String,
            required: true
          },
          image: {
            type: String,
            required: true
          },
          price: {
            type: Number,
            required: true
          },
          badge: {
            type: String,
            default: ''
          }
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

// Ensure user can only have a single wishlist
wishlistSchema.index({ user: 1 }, { unique: true })

export const Wishlist = mongoose.model('Wishlist', wishlistSchema)
export default Wishlist
