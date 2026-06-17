import { Product } from '../models/product.model.js'
import { ApiError } from '../utils/ApiResponse.js'

/**
 * Query products with pagination, filtering, search, and sorting
 * @param {Object} queryParams 
 * @param {boolean} isAdmin 
 * @returns {Promise<Object>}
 */
export const queryProducts = async (queryParams = {}, isAdmin = false) => {
  const {
    page = 1,
    limit = 12,
    search = '',
    category,
    size,
    color,
    minPrice,
    maxPrice,
    sort = 'latest'
  } = queryParams

  const parsedPage = Math.max(1, parseInt(page, 10))
  const parsedLimit = Math.max(1, parseInt(limit, 10))
  const skip = (parsedPage - 1) * parsedLimit

  // Build query
  const query = {}

  // Enforce visibility based on role
  if (!isAdmin) {
    query.status = 'active'
  } else {
    // Admins see draft and active, but not archived unless requested, or all non-archived by default
    query.status = { $ne: 'archived' }
  }

  // Keyword search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
  }

  // Filters
  if (category) {
    query.category = category
  }

  if (size) {
    query.sizes = size
  }

  if (color) {
    query.colors = color.toUpperCase()
  }

  // Price range filters
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {}
    if (minPrice !== undefined && minPrice !== '') {
      query.price.$gte = parseFloat(minPrice)
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      query.price.$lte = parseFloat(maxPrice)
    }
  }

  // Build sorting
  let sortCriteria = { createdAt: -1 }
  switch (sort) {
    case 'price_asc':
      sortCriteria = { price: 1 }
      break;
    case 'price_desc':
      sortCriteria = { price: -1 }
      break;
    case 'popular':
      sortCriteria = { reviewCount: -1, averageRating: -1 }
      break;
    case 'latest':
    default:
      sortCriteria = { createdAt: -1 }
      break;
  }

  const [products, totalItems] = await Promise.all([
    Product.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(parsedLimit),
    Product.countDocuments(query)
  ])

  const totalPages = Math.ceil(totalItems / parsedLimit)

  return {
    products,
    pagination: {
      totalItems,
      totalPages,
      currentPage: parsedPage,
      limit: parsedLimit
    }
  }
}

/**
 * Find single product by slug
 * @param {string} slug 
 * @param {boolean} isAdmin 
 * @returns {Promise<Object>}
 */
export const getProductBySlug = async (slug, isAdmin = false) => {
  const query = { slug }
  if (!isAdmin) {
    query.status = 'active'
  } else {
    query.status = { $ne: 'archived' }
  }

  const product = await Product.findOne(query)
  if (!product) {
    throw new ApiError(404, 'Product not found or has been archived')
  }

  return product
}

/**
 * Get related products based on category
 * @param {string} slug 
 * @returns {Promise<Array>}
 */
export const getRelatedProducts = async (slug) => {
  const currentProduct = await Product.findOne({ slug, status: 'active' })
  if (!currentProduct) {
    throw new ApiError(404, 'Current product not found')
  }

  // Find other active products in the same category
  const relatedProducts = await Product.find({
    category: currentProduct.category,
    slug: { $ne: slug },
    status: 'active'
  })
    .limit(3)
    .sort({ createdAt: -1 })

  return relatedProducts
}

/**
 * Create a new product
 * @param {Object} productData 
 * @returns {Promise<Object>}
 */
export const createProduct = async (productData) => {
  // Check if product SKU or name slug already exists
  if (productData.sku) {
    const existingSku = await Product.findOne({ sku: productData.sku })
    if (existingSku) {
      throw new ApiError(400, 'Product with this SKU already exists')
    }
  }

  const product = new Product(productData)
  await product.save()
  return product
}

/**
 * Update an existing product
 * @param {string} id 
 * @param {Object} updateData 
 * @returns {Promise<Object>}
 */
export const updateProduct = async (id, updateData) => {
  const product = await Product.findById(id)
  if (!product || product.status === 'archived') {
    throw new ApiError(404, 'Product not found')
  }

  if (updateData.sku && updateData.sku !== product.sku) {
    const existingSku = await Product.findOne({ sku: updateData.sku, _id: { $ne: id } })
    if (existingSku) {
      throw new ApiError(400, 'Product with this SKU already exists')
    }
  }

  // Apply updates
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      product[key] = updateData[key]
    }
  })

  await product.save()
  return product
}

/**
 * Soft delete product (status = archived)
 * @param {string} id 
 * @returns {Promise<Object>}
 */
export const softDeleteProduct = async (id) => {
  const product = await Product.findById(id)
  if (!product || product.status === 'archived') {
    throw new ApiError(404, 'Product not found')
  }

  product.status = 'archived'
  await product.save()
  return product
}
