/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1419",
        surface: "#1A2129",
        surfaceAlt: "#151B21",
        border: "#2A333D",
        textPrimary: "#E8EAED",
        textSecondary: "#8B949E",
        accent: "#4A9B8E",
        low: "#5FA876",
        medium: "#D4A15C",
        high: "#C4634F",
      },
      fontFamily: {
        serif: ["Times New Roman", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}