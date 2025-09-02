/* eslint-disable @typescript-eslint/no-require-imports */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-headings": "text-white",
            "--tw-prose-quotes": "text-white",
            "--tw-prose-counters": "text-white",
          },
        },
      }),
      backgroundImage: {
        "countdown-bg": "url('../../public/countdown_item_bg.png')",
      },
      fontFamily: {
        countach: ["Countach", "sans-serif"],
      },
      colors: {
        "primary-green": "#bbfe17",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
