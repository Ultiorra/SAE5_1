/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow': 'rgb(181, 136, 99)',
        'custom-yellow-dark': 'rgb(147, 109, 77)',
        'custom-yellow-light': 'rgb(209, 165, 130)',
      },
    },
  },
  plugins: [],
}

