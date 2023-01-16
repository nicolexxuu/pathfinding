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
            backgroundColor: '#60a5fa',
            borderRadius: '100%'
          },

          '50%': {
            backgroundColor: '#f9a8d4'
          },

          '75%': {
            transform: 'scale(1.2)',
            backgroundColor: '#a5b4fc'
          },

          '100%': {
            transform: 'scale(1)',
            backgroundColor: '#bbf7d0'
          },
        },

        pathAnimation: {
          '0%': {
            transform: 'scale(0.3)',
            backgroundColor: '#fef08a',
            borderRadius: '100%'
          },

          '50%': {
            backgroundColor: '#fef08a'
          },

          '100%': {
            transform: 'scale(1)',
            backgroundColor: '#fef08a'
          },
        }
      },

      animation: {
        'node-visited': 'visitedAnimation 1.5s ease-in-out forwards',
        'node-path': 'pathAnimation 1.5s ease-out forwards',
      },
    },
    plugins: [],
  }
}
