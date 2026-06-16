import PropTypes from 'prop-types'

export const SizePicker = ({ sizes = [], selectedSize, onChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {sizes.map((size) => {
        const isSelected = selectedSize === size
        return (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={`
              w-12 h-12 flex items-center justify-center font-body text-xs font-medium border transition-all duration-150
              ${
                isSelected
                  ? 'bg-[#1A3C2E] border-[#1A3C2E] text-white scale-[1.05] shadow-sm animate-pulse-once'
                  : 'bg-transparent border-[#D8D3CA] text-[#0A0A0A] hover:border-[#1A3C2E]'
              }
            `}
            style={{
              animationIterationCount: 1
            }}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}

SizePicker.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedSize: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default SizePicker
