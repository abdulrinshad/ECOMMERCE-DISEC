/**
 * Calculate tax (VAT) on subtotal
 * @param {number} subtotalAfterDiscount 
 * @returns {number}
 */
export const calculateTax = (subtotalAfterDiscount) => {
  const VAT_RATE = 0.20 // 20% VAT
  return Number((subtotalAfterDiscount * VAT_RATE).toFixed(2))
}
