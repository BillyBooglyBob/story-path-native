// tailwind.config.js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // Include any other directories you might have
    "./screens/**/*.{js,jsx,ts,tsx}", // Include any other directories you might have
    "./components/**/*.{js,jsx,ts,tsx}", // Include any other directories you might have
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
