import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: null
    },
    shippingAddress: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      city: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' }
    },
    memberLevel: {
      type: String,
      enum: ['standard', 'archival'],
      default: 'standard'
    },
    refreshToken: {
      type: String,
      default: null,
      select: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String,
      default: null,
      select: false
    },
    otpExpires: {
      type: Date,
      default: null
    },
    otpAttempts: {
      type: Number,
      default: 0
    },
    otpLockedUntil: {
      type: Date,
      default: null
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    loginLockUntil: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare Password instance method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Override toJSON to exclude sensitive credentials
userSchema.methods.toJSON = function () {
  const userObject = this.toObject()
  delete userObject.password
  delete userObject.refreshToken
  return userObject
}

export const User = mongoose.model('User', userSchema)
export default User
