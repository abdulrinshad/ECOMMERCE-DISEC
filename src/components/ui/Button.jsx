import { useState } from 'react'
import PropTypes from 'prop-types'

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'solid',
  className = '',
  shouldFlash = false,
  ...props
}) => {
  const [isFlashed, setIsFlashed] = useState(false)

  const handleClick = (e) => {
    if (shouldFlash) {
      setIsFlashed(true)
      setTimeout(() => setIsFlashed(false), 300)
    }
    if (onClick) onClick(e)
  }

  const baseStyles = 'inline-flex items-center justify-center font-body text-xs font-medium uppercase tracking-[0.12em] transition-all duration-120 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3C2E] focus-visible:ring-offset-2'
  
  const solidStyles = `bg-[#1A3C2E] text-white hover:bg-[#2D6B4F] ${isFlashed ? 'bg-[#2D6B4F]' : ''}`
  const outlineStyles = 'border border-[#1A3C2E] text-[#1A3C2E] hover:bg-[#1A3C2E] hover:text-white bg-transparent'

  const selectedStyles = variant === 'outline' ? outlineStyles : solidStyles

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`${baseStyles} ${selectedStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['solid', 'outline']),
  className: PropTypes.string,
  shouldFlash: PropTypes.bool,
}

export default Button
