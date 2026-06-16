import { forwardRef } from 'react'
import PropTypes from 'prop-types'

export const UnderlineInput = forwardRef(({
  label,
  placeholder,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  error = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`group relative w-full flex flex-col ${className}`} ref={ref}>
      {label && (
        <label className="font-body text-[10px] font-medium tracking-[0.12em] text-[#5C5C5C] uppercase mb-1">
          {label} {required && <span className="text-[#1A3C2E]">*</span>}
        </label>
      )}
      
      <div className="relative w-full">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-transparent border-b ${
            error ? 'border-red-500' : 'border-[#D8D3CA]'
          } py-3 text-sm font-body font-light text-[#0A0A0A] placeholder:text-[#5C5C5C]/50 placeholder:uppercase focus:outline-none transition-colors duration-250`}
          {...props}
        />
        {/* Animated underline */}
        <span 
          className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#1A3C2E] origin-left scale-x-0 transition-transform duration-250 ease-out group-focus-within:scale-x-100" 
        />
      </div>
    </div>
  )
})

UnderlineInput.displayName = 'UnderlineInput'

UnderlineInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  error: PropTypes.bool,
  className: PropTypes.string,
}

export default UnderlineInput
