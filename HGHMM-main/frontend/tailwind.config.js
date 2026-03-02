/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: '380px',
        md: '420px',
        lg: '680px',
        xl: '768px',
        '2xl': '1024px',
      },
    },
  },
  plugins: [],
};
