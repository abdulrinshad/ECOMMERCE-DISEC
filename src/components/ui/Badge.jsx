import PropTypes from 'prop-types'

export const Badge = ({ children, className }) => {
  if (!children) return null
  return (
    <span
      className={`inline-block bg-[#1A3C2E] text-white text-[10px] font-medium tracking-[0.12em] uppercase px-3 py-1 font-body select-none ${className}`}
    >
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default Badge
