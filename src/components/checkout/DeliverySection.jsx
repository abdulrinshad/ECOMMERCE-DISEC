import PropTypes from 'prop-types'
import UnderlineInput from './UnderlineInput'

export const DeliverySection = ({
  formData,
  setFormData,
  fieldRefs
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const countries = [
    { code: 'US', name: 'UNITED STATES' },
    { code: 'GB', name: 'UNITED KINGDOM' },
    { code: 'FR', name: 'FRANCE' },
    { code: 'DE', name: 'GERMANY' },
    { code: 'JP', name: 'JAPAN' },
    { code: 'CA', name: 'CANADA' },
    { code: 'AU', name: 'AUSTRALIA' }
  ]

  return (
    <div className="checkout-section border-b border-[#D8D3CA] pb-10 mb-10">
      <h3 className="font-body text-xs font-medium tracking-[0.12em] text-[#5C5C5C] uppercase mb-6">
        02 / DELIVERY DESTINATION
      </h3>

      <div className="space-y-6">
        {/* Name Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div ref={fieldRefs.firstName}>
            <UnderlineInput
              label="FIRST NAME"
              placeholder="FIRST NAME"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div ref={fieldRefs.lastName}>
            <UnderlineInput
              label="LAST NAME"
              placeholder="LAST NAME"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Address Line 1 */}
        <div ref={fieldRefs.address1}>
          <UnderlineInput
            label="ADDRESS LINE 01"
            placeholder="ADDRESS LINE 01"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <UnderlineInput
            label="ADDRESS LINE 02"
            placeholder="ADDRESS LINE 02 (APARTMENT, SUITE, ETC.)"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
          />
        </div>

        {/* City and Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div ref={fieldRefs.city}>
            <UnderlineInput
              label="CITY"
              placeholder="CITY"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div ref={fieldRefs.postalCode}>
            <UnderlineInput
              label="POSTAL CODE"
              placeholder="POSTAL CODE"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Country Dropdown */}
        <div className="group relative flex flex-col w-full" ref={fieldRefs.country}>
          <label className="font-body text-[10px] font-medium tracking-[0.12em] text-[#5C5C5C] uppercase mb-1">
            COUNTRY <span className="text-[#1A3C2E]">*</span>
          </label>
          <div className="relative w-full">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-[#D8D3CA] py-3 text-sm font-body font-light text-[#0A0A0A] appearance-none focus:outline-none transition-colors duration-250 uppercase"
            >
              <option value="" disabled className="text-[#5C5C5C]/50">SELECT COUNTRY</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code} className="text-[#0A0A0A]">
                  {c.name}
                </option>
              ))}
            </select>
            {/* Underline */}
            <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#1A3C2E] origin-left scale-x-0 transition-transform duration-250 ease-out group-focus-within:scale-x-100" />
            
            {/* Custom dropdown arrow */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#5C5C5C] group-focus-within:text-[#1A3C2E] transition-colors duration-250">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

DeliverySection.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  fieldRefs: PropTypes.object.isRequired
}

export default DeliverySection
