import * as productService from '../services/product.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

/**
 * Get all active products (or all products for admin queries)
 * GET /api/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'admin'
    const result = await productService.queryProducts(req.query, isAdmin)

    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result.products,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get a single product by slug
 * GET /api/products/:slug
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const isAdmin = req.user?.role === 'admin'
    const product = await productService.getProductBySlug(slug, isAdmin)

    return res.status(200).json(
      new ApiResponse(200, product, 'Product retrieved successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get related products based on current category
 * GET /api/products/:slug/related
 */
export const getRelatedProducts = async (req, res, next) => {
  try {
    const { slug } = req.params
    const related = await productService.getRelatedProducts(slug)

    return res.status(200).json(
      new ApiResponse(200, related, 'Related products retrieved successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Create new product record
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body)

    return res.status(201).json(
      new ApiResponse(201, product, 'Product created successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Update an existing product
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await productService.updateProduct(id, req.body)

    return res.status(200).json(
      new ApiResponse(200, product, 'Product updated successfully')
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Soft delete a product
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await productService.softDeleteProduct(id)

    return res.status(200).json(
      new ApiResponse(200, product, 'Product archived successfully')
    )
  } catch (error) {
    next(error)
  }
}
