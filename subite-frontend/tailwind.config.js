/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        text: '#F8FAFC',
        'muted-text': '#94A3B8',
        border: '#CBD5E1',
        'error-status': '#FEE2E2',
        'success-status': '#D1FAE5',
        'warning-status': '#FEF3C7',
      },
    },
  },
  plugins: [],
}
