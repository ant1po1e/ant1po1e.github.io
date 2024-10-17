/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require('flowbite/plugin')
  ],
  content: ['index.html', './contact/index.html', './projects/index.html', './tools/index.html', './tools/snap-calculator.html', './tools/bbcode-colorizer.html', './dist/flowbite/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

