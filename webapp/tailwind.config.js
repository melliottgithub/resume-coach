/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
        fontFamily: {
            sans: ['"DM Sans"', ...defaultTheme.fontFamily.sans]
        }
    },
  },
  plugins: [
      require('@tailwindcss/typography'),
  ],
}

