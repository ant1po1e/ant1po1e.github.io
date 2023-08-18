/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '16px'
    },
    extend: {
      colors: {
        primary: '#38bdf8',
        secondary: '#64748b',
        dark: '#1e293b'
      },
      screens: {
        '2xl': '1320px'
      }
    },
  },
  plugins: [],
}

