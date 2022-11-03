/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inconsolata: ['"Inconsolata"', ...defaultTheme.fontFamily.sans] // why three dots
      },

      keyframes: {
        visitedAnimation: {
          '0%': {
            transform: 'scale(0.3)',
            backgroundColor: 'rgba(0, 0, 66, 0.75)',
            borderRadius: '100%'
          },

          '50%': {
            backgroundColor: 'rgba(217, 17, 187, 0.75)'
          },

          '75%': {
            transform: 'scale(1.2)',
            backgroundColor: 'rgba(34, 17, 217, 0.75)'
          },

          '100%': {
            transform: 'scale(1)',
            backgroundColor: 'rgba(0, 218, 69, 0.75)'
          },
        }
      },

      animation: {
        'node-visited': 'visitedAnimation 1.5s ease-in-out forwards',
      },
    },
    plugins: [],
  }
}
