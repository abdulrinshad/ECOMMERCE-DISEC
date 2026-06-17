/**
 * Calculate shipping fee based on shipping method
 * @param {string} method - 'standard' or 'express'
 * @returns {number}
 */
export const calculateShippingFee = (method) => {
  if (method === 'express') {
    return 18.00
  }
  return 0.00
}
