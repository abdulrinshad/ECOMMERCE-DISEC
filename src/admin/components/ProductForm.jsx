import React, { useState, useEffect } from 'react'
import { ALLOWED_CATEGORIES, ALLOWED_SIZES, ALLOWED_STATUSES } from '../../constants/product.constants.js'

export const ProductForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    brand: '',
    category: ALLOWED_CATEGORIES[0] || 'outerwear',
    subCategory: '',
    price: 0,
    compareAtPrice: '',
    stock: 0,
    images: '',
    thumbnail: '',
    sizes: [],
    colors: '',
    badge: '',
    limitedCount: '',
    status: ALLOWED_STATUSES[0] || 'draft',
    metaTitle: '',
    metaDescription: ''
  })

  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        shortDescription: initialData.shortDescription || '',
        brand: initialData.brand || '',
        category: initialData.category || ALLOWED_CATEGORIES[0] || 'outerwear',
        subCategory: initialData.subCategory || '',
        price: initialData.price || 0,
        compareAtPrice: initialData.compareAtPrice || '',
        stock: initialData.stock || 0,
        images: initialData.images ? initialData.images.join(', ') : '',
        thumbnail: initialData.thumbnail || '',
        sizes: initialData.sizes || [],
        colors: initialData.colors ? initialData.colors.join(', ') : '',
        badge: initialData.badge || '',
        limitedCount: initialData.limitedCount || '',
        status: initialData.status || ALLOWED_STATUSES[0] || 'draft',
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || ''
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const isSelected = prev.sizes.includes(size)
      return {
        ...prev,
        sizes: isSelected 
          ? prev.sizes.filter((s) => s !== size) 
          : [...prev.sizes, size]
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validations
    if (formData.price <= 0) {
      setError('Price must be greater than 0.')
      return
    }
    if (formData.compareAtPrice && Number(formData.compareAtPrice) < formData.price) {
      setError('Compare At Price must be greater than or equal to Price.')
      return
    }
    if (!formData.images.trim()) {
      setError('At least one product image URL is required.')
      return
    }

    setError('')

    // Prepare payload
    const payload = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      stock: Number(formData.stock),
      limitedCount: formData.limitedCount ? Number(formData.limitedCount) : null,
      images: formData.images.split(',').map((img) => img.trim()).filter((img) => img.length > 0),
      colors: formData.colors.split(',').map((c) => c.trim().toUpperCase()).filter((c) => c.length > 0)
    }

    if (!payload.thumbnail && payload.images.length > 0) {
      payload.thumbnail = payload.images[0]
    }

    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#D8D3CA] p-6 space-y-6 max-h-[85vh] overflow-y-auto uppercase">
      <h3 className="font-display text-sm font-extrabold uppercase tracking-widest text-[#0A0A0A] border-b border-[#D8D3CA]/60 pb-2">
        {initialData ? 'EDIT PRODUCT REGISTRATION' : 'CREATE PRODUCT PROTOCOL'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 text-[10px] text-red-800 font-display font-extrabold uppercase tracking-widest">
          {error}
        </div>
      )}

      {/* Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Name */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Product Name *
          </label>
          <input
            type="text"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
            placeholder="E.G. SYNTHETIC DISTORTION PARKA"
          />
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Brand Name
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
            placeholder="AVANT-GARDE"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A] cursor-pointer"
          >
            {ALLOWED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Category */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Sub Category
          </label>
          <input
            type="text"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
            placeholder="SHELLS"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Price ($) *
          </label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none text-[#0A0A0A]"
          />
        </div>

        {/* Compare At Price */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Compare At Price (Discount Base, $)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            name="compareAtPrice"
            value={formData.compareAtPrice}
            onChange={handleChange}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none text-[#0A0A0A]"
          />
        </div>

        {/* Stock */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Stock Quantity *
          </label>
          <input
            type="number"
            required
            min="0"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none text-[#0A0A0A]"
          />
        </div>

        {/* Limited Count */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Limited Edition Total Pieces count
          </label>
          <input
            type="number"
            min="1"
            name="limitedCount"
            value={formData.limitedCount}
            onChange={handleChange}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none text-[#0A0A0A]"
            placeholder="E.G. 100"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Publication Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A] cursor-pointer"
          >
            {ALLOWED_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Badge */}
        <div className="space-y-2">
          <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
            Custom Product Badge
          </label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
            placeholder="NEW ARRIVAL / ARCHIVE EXCLUSIVE"
          />
        </div>

      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
          Product Description *
        </label>
        <textarea
          required
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
          placeholder="ENTER LONG FORM ARCHIVAL PRODUCT DETAILS..."
        />
      </div>

      {/* Images List (URLs separated by comma) */}
      <div className="space-y-2">
        <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
          Product Images (URLs separated by commas) *
        </label>
        <textarea
          required
          rows={2}
          name="images"
          value={formData.images}
          onChange={handleChange}
          className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none text-[#0A0A0A]"
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
        />
      </div>

      {/* Colors Input */}
      <div className="space-y-2">
        <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
          Colors (Separated by commas) *
        </label>
        <input
          type="text"
          name="colors"
          value={formData.colors}
          onChange={handleChange}
          className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
          placeholder="CARBON BLACK, OATMEAL, SAGE GREEN"
        />
      </div>

      {/* Sizes Selection */}
      <div className="space-y-3">
        <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
          Sizes Checklist *
        </label>
        <div className="flex flex-wrap gap-3">
          {ALLOWED_SIZES.map((size) => {
            const isChecked = formData.sizes.includes(size)
            return (
              <button
                type="button"
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 border font-display text-[10px] font-extrabold transition-all cursor-pointer ${
                  isChecked 
                    ? 'bg-[#1A3C2E] border-[#1A3C2E] text-white' 
                    : 'bg-white border-[#D8D3CA] text-[#7C766C]'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* SEO Section */}
      <div className="border-t border-[#D8D3CA] pt-6 space-y-4">
        <h4 className="font-display text-xs font-extrabold uppercase tracking-widest text-[#7C766C]">
          SEO METADATA (OPTIONAL)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
              Meta Title
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
              placeholder="META TITLE TAG"
            />
          </div>

          <div className="space-y-2">
            <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#5C5C5C] block">
              Meta Description
            </label>
            <input
              type="text"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              className="w-full bg-white border border-[#D8D3CA] p-3 text-xs font-body tracking-wider focus:border-[#1A3C2E] focus:outline-none uppercase text-[#0A0A0A]"
              placeholder="META DESCRIPTION CONTENT"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4 border-t border-[#D8D3CA]">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-grow bg-transparent hover:bg-neutral-100 text-[#0A0A0A] border border-[#D8D3CA] py-4 font-display text-[10px] font-bold uppercase tracking-widest transition-colors duration-200"
        >
          CANCEL
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-grow bg-[#1A3C2E] hover:bg-[#2D6B4F] text-white border-none py-4 font-display text-[10px] font-extrabold uppercase tracking-widest transition-colors duration-200 active:scale-[0.98]"
        >
          {isSubmitting ? 'PROCESSING PROTOCOL...' : 'SAVE PRODUCT'}
        </button>
      </div>
    </form>
  )
}

export default React.memo(ProductForm)
