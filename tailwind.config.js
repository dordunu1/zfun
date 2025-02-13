/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'ticker': 'ticker 50s linear infinite',
        'flame': 'flame 3s ease-in-out infinite',
        'flame-slow': 'flame-slow 4s ease-in-out infinite',
        'flame-slower': 'flame-slower 5s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        flame: {
          '0%': { transform: 'scaleY(1) translateY(0)' },
          '50%': { transform: 'scaleY(1.2) translateY(-20px) rotate(-1deg)' },
          '100%': { transform: 'scaleY(1) translateY(0)' },
        },
        'flame-slow': {
          '0%': { transform: 'scaleY(1) translateY(0) rotate(1deg)' },
          '50%': { transform: 'scaleY(1.25) translateY(-25px) rotate(-1deg)' },
          '100%': { transform: 'scaleY(1) translateY(0) rotate(1deg)' },
        },
        'flame-slower': {
          '0%': { transform: 'scaleY(1) translateY(0) rotate(-1deg)' },
          '50%': { transform: 'scaleY(1.3) translateY(-30px) rotate(1deg)' },
          '100%': { transform: 'scaleY(1) translateY(0) rotate(-1deg)' },
        },
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#2d2f36',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#00ffbd',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#00e6a9',
          },
        },
      }
      addUtilities(newUtilities, ['dark'])
    }
  ],
}