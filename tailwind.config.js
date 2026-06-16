/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#F2EFE9',
        'bg-surface': '#E8E4DC',
        'bg-dark': '#1A3C2E',
        'bg-card': '#FFFFFF',
        'text-primary': '#0A0A0A',
        'text-secondary': '#5C5C5C',
        'accent': '#1A3C2E',
        'accent-hover': '#2D6B4F',
        'border-color': '#D8D3CA',
        'badge-green': '#1A3C2E',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.12em',
        ticker: '0.1em',
      },
      animation: {
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
