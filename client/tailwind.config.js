/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#0a0a0a',
        surface: '#111111',
        border: '#1e1e1e',
        accent: '#3ddc84',
        'accent-dim': '#2ab86a',
        muted: '#3a3a3a',
        subtle: '#6b6b6b',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-green': 'pulseGreen 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(61,220,132,0.3)' },
          '50%': { boxShadow: '0 0 0 8px rgba(61,220,132,0)' },
        },
      },
    },
  },
  plugins: [],
}
