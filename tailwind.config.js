/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a', // Noir profond façon Higgsfield
        surface: '#151515',    // Gris très foncé pour les cartes
        primary: '#b0ff00',    // Vert fluo / Lime green (accent très courant dans les apps AI modernes)
        secondary: '#a78bfa',  // Violet doux pour des variations
        text: '#f8fafc',       // Blanc presque pur
        textMuted: '#94a3b8',  // Gris pour textes secondaires
        border: '#27272a',     // Bordure discrète
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Police moderne
      }
    },
  },
  plugins: [],
}
