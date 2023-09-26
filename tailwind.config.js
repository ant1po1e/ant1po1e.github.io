/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html',  './node_modules/flowbite/**/*.js'],
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
  plugins: [
    require('tailwind-scrollbar'),
    require('flowbite/plugin')
  ],
}

