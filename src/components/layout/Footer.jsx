import { Link } from 'react-router-dom'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1A3C2E] text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start pb-20 border-b border-[#D8D3CA]/20">
          {/* Left Block */}
          <div>
            <h2 className="font-display text-5xl md:text-7xl font-extrabold uppercase tracking-tighter leading-none select-none">
              AVANT-<br />GARDE
            </h2>
            <p className="mt-6 font-body text-xs text-[#E8E4DC]/60 max-w-sm leading-relaxed tracking-wide">
              Documenting the evolution of form. Highly limited drops, engineered details, and archival fashion designs.
            </p>
          </div>

          {/* Right Block */}
          <div className="flex flex-col md:items-end justify-between h-full md:pt-4">
            <div className="flex flex-col space-y-4 font-body text-xs font-medium uppercase tracking-[0.12em]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8E4DC] transition-colors"
              >
                INSTAGRAM
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8E4DC] transition-colors"
              >
                TWITTER
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E8E4DC] transition-colors"
              >
                DISCORD
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Block */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-12 font-body text-[10px] uppercase tracking-widest text-[#E8E4DC]/40 gap-4">
          <div>
            © {currentYear} AVANT-GARDE. ALL RIGHTS RESERVED.
          </div>
          <div className="hover:text-white transition-colors cursor-default">
            HANDCRAFTED BY THE GRID
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
