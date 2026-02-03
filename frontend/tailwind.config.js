/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all React files
  ],
  theme: {
    extend: {
      fontFamily: {
        corporate: ['"Playfair Display"', 'serif'], // Calligraphy font
      },
    },
  },
  plugins: [],
};
