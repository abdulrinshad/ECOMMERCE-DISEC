import PropTypes from 'prop-types'
import UnderlineInput from './UnderlineInput'

export const ContactSection = ({ email, setEmail, keepUpdated, setKeepUpdated, emailRef }) => {
  return (
    <div className="checkout-section border-b border-[#D8D3CA] pb-10 mb-10">
      <h3 className="font-body text-xs font-medium tracking-[0.12em] text-[#5C5C5C] uppercase mb-6">
        01 / CONTACT IDENTITY
      </h3>
      
      <div className="space-y-6">
        <div ref={emailRef}>
          <UnderlineInput
            label="EMAIL ADDRESS"
            placeholder="EMAIL ADDRESS"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <label className="flex items-center space-x-3 cursor-pointer group select-none">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              checked={keepUpdated}
              onChange={(e) => setKeepUpdated(e.target.checked)}
              className="peer sr-only"
            />
            {/* Custom Checkbox Box */}
            <div className="w-4 h-4 border border-[#D8D3CA] bg-transparent transition-all duration-200 peer-checked:bg-[#1A3C2E] peer-checked:border-[#1A3C2E] flex items-center justify-center">
              {/* Checkmark icon */}
              <svg
                className="w-2.5 h-2.5 text-white scale-0 transition-transform duration-200 peer-checked:scale-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="font-body text-[11px] tracking-wider text-[#5C5C5C] uppercase font-light group-hover:text-[#0A0A0A] transition-colors">
            KEEP ME UPDATED ON NEW DROPS
          </span>
        </label>
      </div>
    </div>
  )
}

ContactSection.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  keepUpdated: PropTypes.bool.isRequired,
  setKeepUpdated: PropTypes.func.isRequired,
  emailRef: PropTypes.object,
}

export default ContactSection
