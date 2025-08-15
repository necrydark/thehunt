/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "countdown-bg": "url('../../public/countdown_item_bg.png')"
      },
      fontFamily: {
        countach: ['Countach', 'sans-serif'],
      },
      colors: {
        'primary-green': '#bbfe17',
      },
    },
  },
  plugins: [],
}
