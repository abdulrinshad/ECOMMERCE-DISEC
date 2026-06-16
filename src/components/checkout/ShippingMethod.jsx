import PropTypes from 'prop-types'

export const ShippingMethod = ({ selectedMethod, setSelectedMethod }) => {
  const options = [
    {
      id: 'standard',
      name: 'STANDARD ARCHIVE TRANSIT',
      time: '5–7 days',
      price: 0,
      priceLabel: 'FREE'
    },
    {
      id: 'express',
      name: 'EXPRESS COURIER PROTOCOL',
      time: '1–2 days',
      price: 18,
      priceLabel: '$18.00'
    }
  ]

  return (
    <div className="checkout-section border-b border-[#D8D3CA] pb-10 mb-10">
      <h3 className="font-body text-xs font-medium tracking-[0.12em] text-[#5C5C5C] uppercase mb-6">
        03 / TRANSIT METHOD
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedMethod === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedMethod(option.id)}
              className={`w-full text-left p-5 border flex items-center justify-between cursor-pointer transition-all duration-200 ease-in-out ${
                isSelected
                  ? 'border-[#1A3C2E] bg-[#1A3C2E]/[0.04]'
                  : 'border-[#D8D3CA] bg-white hover:border-[#5C5C5C]'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Radio Dot */}
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                  isSelected ? 'border-[#1A3C2E]' : 'border-[#D8D3CA]'
                }`}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1A3C2E]" />
                  )}
                </div>

                {/* Text Details */}
                <div>
                  <div className="font-display text-xs font-extrabold uppercase tracking-tight text-[#0A0A0A]">
                    {option.name}
                  </div>
                  <div className="font-body text-[11px] font-light text-[#5C5C5C] mt-1">
                    {option.time}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="font-display text-xs font-extrabold text-[#0A0A0A] ml-4">
                {option.priceLabel}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

ShippingMethod.propTypes = {
  selectedMethod: PropTypes.string.isRequired,
  setSelectedMethod: PropTypes.func.isRequired
}

export default ShippingMethod
