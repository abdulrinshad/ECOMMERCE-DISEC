import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useScrollReveal } from '../hooks/useScrollReveal'

export const Login = () => {
  const navigate = useNavigate()
  const revealRef = useScrollReveal()

  const handleLogin = (e) => {
    e.preventDefault()
    // Simulated successful login and redirection
    navigate('/dashboard')
  }

  return (
    <main className="w-full min-h-screen flex flex-col md:flex-row bg-[#F2EFE9]">
      {/* Left Column: 50% width bleed editorial photo */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-screen relative overflow-hidden bg-bg-dark border-b md:border-b-0 md:border-r border-[#D8D3CA]">
        <img
          src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
          alt="Login Editorial visual"
          className="w-full h-full object-cover object-center brightness-75 select-none"
        />
        <div className="absolute bottom-10 left-10 text-white z-10 space-y-2">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-none">
            AVANT-GARDE
          </h2>
          <p className="font-body text-[10px] uppercase tracking-widest text-[#E8E4DC]/80 font-medium">
            ARCHIVAL FASHION FOR THE MODERN ICONOCLAST
          </p>
        </div>
      </div>

      {/* Right Column: 50% width cream container */}
      <div
        ref={revealRef}
        className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 min-h-[60vh] md:min-h-screen"
      >
        <div className="w-full max-w-md space-y-10">
          <div>
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">
              ACCESS ACCOUNT
            </h1>
            <p className="font-body text-[10px] font-medium uppercase tracking-widest text-text-secondary mt-2">
              CHOOSE YOUR PATH OR ENTER CREDENTIALS
            </p>
          </div>

          {/* Social Sign-In buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="py-3.5 border border-[#D8D3CA] hover:border-[#1A3C2E] hover:bg-white transition-all duration-150 font-body text-[10px] font-medium uppercase tracking-widest text-[#0A0A0A]"
            >
              APPLE ID
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="py-3.5 border border-[#D8D3CA] hover:border-[#1A3C2E] hover:bg-white transition-all duration-150 font-body text-[10px] font-medium uppercase tracking-widest text-[#0A0A0A]"
            >
              GOOGLE
            </button>
          </div>

          <div className="flex items-center gap-4 select-none">
            <span className="h-[1px] bg-[#D8D3CA] flex-1"></span>
            <span className="font-body text-[9px] uppercase tracking-widest text-text-secondary font-medium">
              OR CONTINUE WITH EMAIL
            </span>
            <span className="h-[1px] bg-[#D8D3CA] flex-1"></span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-text-secondary block">
                EMAIL IDENTITY
              </label>
              <input
                type="email"
                required
                className="w-full bg-transparent border-b border-[#D8D3CA] focus:border-[#1A3C2E] py-2 text-xs font-body tracking-wider placeholder-text-secondary/40 focus:outline-none uppercase text-[#0A0A0A]"
                placeholder="ENTER EMAIL ADDRESS"
              />
            </div>

            <div className="space-y-2">
              <label className="font-body text-[9px] font-semibold uppercase tracking-widest text-text-secondary block">
                SECRET KEY
              </label>
              <input
                type="password"
                required
                className="w-full bg-transparent border-b border-[#D8D3CA] focus:border-[#1A3C2E] py-2 text-xs font-body tracking-wider placeholder-text-secondary/40 focus:outline-none uppercase text-[#0A0A0A]"
                placeholder="ENTER PASSWORD"
              />
            </div>

            {/* Remember/Forgot options */}
            <div className="flex items-center justify-between font-body text-[10px] font-semibold uppercase tracking-widest text-[#0A0A0A]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded-none border-[#D8D3CA] text-[#1A3C2E] focus:ring-[#1A3C2E] h-3.5 w-3.5 bg-transparent"
                />
                <span>REMEMBER IDENTITY</span>
              </label>
              <button
                type="button"
                className="hover:underline transition-all text-text-secondary"
              >
                FORGOT?
              </button>
            </div>

            {/* Action buttons */}
            <div className="space-y-4 pt-4">
              <Button
                type="submit"
                variant="solid"
                className="w-full py-4 tracking-widest text-xs"
              >
                INITIALIZE ACCESS
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => alert('CREATE ACCOUNT PATH INITIALIZED')}
                className="w-full py-4 tracking-widest text-xs"
              >
                CREATE ARCHIVE ACCOUNT
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login
