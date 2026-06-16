import bcrypt from 'bcryptjs'

/**
 * Generate a random 6-digit numeric OTP code
 * @returns {string}
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Hash a plain OTP string using bcrypt
 * @param {string} otp 
 * @returns {Promise<string>}
 */
export const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10)
}

/**
 * Compare plain OTP against stored hashed OTP
 * @param {string} plainOtp 
 * @param {string} hashedOtp 
 * @returns {Promise<boolean>}
 */
export const compareOTP = async (plainOtp, hashedOtp) => {
  return await bcrypt.compare(plainOtp, hashedOtp)
}
