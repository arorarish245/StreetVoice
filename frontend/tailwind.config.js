/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust according to your directory structure
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B262C",
        secondary: "#0F4C75",
        accent: "#3282B8",
        background: "#BBE1FA",
      },
    }
  },
  plugins: [],
}
