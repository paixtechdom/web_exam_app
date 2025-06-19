/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors :{ 
        "primary": "rgba(0,0,24)",
        "secondary": "rgba(0,0,10)",
      }
    },
  },
  plugins: [],
}

