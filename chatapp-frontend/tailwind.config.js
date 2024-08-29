/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontSize: {
        'tiny': '14px',
        'normal': '16px',
        'huge': '26px',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}