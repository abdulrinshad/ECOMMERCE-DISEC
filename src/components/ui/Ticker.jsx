import PropTypes from 'prop-types'

export const Ticker = ({ text = "NEW DROP / SERIES 044 AVAILABLE NOW ★ LIMITED ARCHIVE" }) => {
  // We duplicate the text to fill the screen width and support seamless marquee transition
  const items = Array(10).fill(text)

  return (
    <div className="w-full bg-[#1A3C2E] text-white py-3 overflow-hidden select-none border-y border-[#D8D3CA]/20">
      <div className="flex whitespace-nowrap w-max">
        <div className="animate-marquee inline-flex gap-8 px-4 font-body text-xs font-medium uppercase tracking-[0.1em]">
          {items.map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

Ticker.propTypes = {
  text: PropTypes.string,
}

export default Ticker
