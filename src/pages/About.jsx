import { useScrollReveal } from '../hooks/useScrollReveal'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'

export const About = () => {
  const heroRevealRef = useScrollReveal()
  const valuesRevealRef = useScrollReveal()
  const historyRevealRef = useScrollReveal()

  return (
    <main className="w-full bg-[#F2EFE9] text-[#0A0A0A] overflow-hidden">
      {/* 1. HERO SECTION */}
      <section
        ref={heroRevealRef}
        className="max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
      >
        <div className="lg:col-span-7 space-y-8">
          <span className="font-body text-xs font-medium uppercase tracking-[0.12em] text-[#5C5C5C]">
            OUR GENESIS
          </span>
          <h1 className="font-display text-[clamp(48px,7vw,90px)] font-extrabold uppercase leading-[0.9] tracking-tighter text-[#0A0A0A]">
            ABOUT<br />AVANT-<br />GARDE
          </h1>
          <p className="font-body text-sm font-light text-text-secondary leading-relaxed tracking-wide max-w-xl">
            Established in 2024, AVANT-GARDE exists at the convergence of architectural utility and modern technical apparel. We reject transient styling to document structural integrity, advanced textiles, and ergonomic motion.
          </p>
        </div>
        <div className="lg:col-span-5 aspect-[4/5] bg-bg-surface overflow-hidden border border-[#D8D3CA]">
          <img
            src="https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1000&auto=format&fit=crop"
            alt="Editorial Avant Garde concept"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* 2. PHILOSOPHY / STATEMENT */}
      <section className="w-full bg-[#E8E4DC] py-32 px-6 border-y border-[#D8D3CA]">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <span className="font-body text-[10px] font-semibold uppercase tracking-widest text-[#5C5C5C]">
            THE MANIFESTO
          </span>
          <blockquote className="font-display text-2xl md:text-5xl font-extrabold uppercase tracking-tighter leading-tight max-w-5xl mx-auto">
            "CLOTHING IS AN INTERFACE BETWEEN THE HUMAN FORM AND THE METROPOLITAN ENVIRONMENT."
          </blockquote>
          <p className="font-body text-xs text-text-secondary max-w-lg mx-auto leading-relaxed tracking-wider uppercase">
            WE FABRICATE EACH COMPONENT TO COMPLY WITH PHYSICAL CONSTRAINTS. NOT AS A STATIC ORNAMENT, BUT AS AN ACTIVE SHELL FOR SURVIVAL AND EXPRESSION.
          </p>
        </div>
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section ref={valuesRevealRef} className="max-w-7xl mx-auto px-6 py-28 space-y-16">
        <div className="border-b border-[#D8D3CA] pb-4">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-widest text-[#0A0A0A]">
            DESIGN PROTOCOLS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Protocol 1 */}
          <div className="space-y-4">
            <span className="font-display text-xl font-bold text-[#1A3C2E]">01 // MATERIALITY</span>
            <p className="font-body text-xs text-text-secondary leading-relaxed uppercase">
              We engineer with high-density nylon membranes, liquid crystal laminates, Kevlar grids, and water-repellent (DWR) structures designed for longevity.
            </p>
          </div>
          {/* Protocol 2 */}
          <div className="space-y-4">
            <span className="font-display text-xl font-bold text-[#1A3C2E]">02 // ERGONOMICS</span>
            <p className="font-body text-xs text-text-secondary leading-relaxed uppercase">
              Articulated patterns shape sleeve rotations, panel offsets, and custom magnetic pocket overlays to enable natural organic movement.
            </p>
          </div>
          {/* Protocol 3 */}
          <div className="space-y-4">
            <span className="font-display text-xl font-bold text-[#1A3C2E]">03 // UTILITY</span>
            <p className="font-body text-xs text-text-secondary leading-relaxed uppercase">
              Modular components, chest harnesses, detachable tech hoods, and multi-zip configuration paths redefine accessibility and safety.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HISTORY / TIMELINE */}
      <section ref={historyRevealRef} className="bg-[#E8E4DC] border-t border-[#D8D3CA] py-28 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="border-b border-[#0A0A0A]/20 pb-4">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-widest text-[#0A0A0A]">
              THE CHRONOLOGY
            </h2>
          </div>

          <div className="space-y-12">
            {[
              { year: '2022', title: 'INITIAL LAB PROTOCOLS', desc: 'FOUNDATION OF THE STUDIO. SYSTEMATIC EXPERIMENTATION WITH REACTIVE RAW DWR COATINGS.' },
              { year: '2023', title: 'SERIES 001 LAUNCH', desc: 'FIRST PUBLIC REVEAL OF ASYMMETRIC METROPOLITAN APPAREL CARDS AT PARIS ARCHIVES.' },
              { year: '2024', title: 'SERIES 044: STATIC', desc: 'INTEGRATED Fidlock MECHANISMS AND LIQUID CRYSTAL SHELL SYSTEMS RELEASED GLOBALLY.' }
            ].map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline border-b border-[#D8D3CA]/40 pb-8 last:border-0">
                <div className="md:col-span-2 font-display text-2xl font-extrabold text-[#1A3C2E]">
                  {item.year}
                </div>
                <div className="md:col-span-4 font-display text-sm font-bold uppercase text-[#0A0A0A]">
                  {item.title}
                </div>
                <div className="md:col-span-6 font-body text-xs text-text-secondary leading-relaxed uppercase">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ACCESS CTA */}
      <section className="max-w-7xl mx-auto px-6 py-28 text-center space-y-8">
        <h2 className="font-display text-3xl font-extrabold uppercase text-[#0A0A0A]">
          DISCOVER THE PIECES
        </h2>
        <Link to="/shop" className="inline-block">
          <Button variant="solid" className="px-12 py-4 tracking-widest text-xs">
            VIEW THE ARCHIVES
          </Button>
        </Link>
      </section>
    </main>
  )
}

export default About
