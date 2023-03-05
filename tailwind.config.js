/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: require("./data.json").extend || {},
  },
  safelist: [...require("./data.json").safelist],
  plugins: [require("daisyui")],
}