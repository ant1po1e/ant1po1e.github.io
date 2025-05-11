/** @type {import('tailwindcss').Config} */
import fluid, { extract, screens } from 'fluid-tailwind'

module.exports = {
  content: {
    files: [
      'index.html',
      './contact/index.html',
      './projects/index.html',
      './tools/index.html',
      './tools/snap-calculator.html',
      './tools/bbcode-colorizer.html',
      './tools/todo.html',
      './dist/flowbite/**/*.js'
    ],
    extract: {
      DEFAULT: extract
    }
  },
  theme: {
    extend: {
      fluidType: {
        settings: {
          fontSizeMin: 1.125, 
          fontSizeMax: 3,     
          screenMin: 320,    
          screenMax: 1280,  
        },
        values: {
          sm: [1, 1.5], 
          base: [1.125, 2],
          lg: [1.5, 3],
          xl: [2, 4],
        },
      },
    },
  },
  plugins: [
    fluid,
    require('flowbite/plugin')
  ],
}
