/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ea580c',
          foreground: '#ffffff',
        },
        background: '#ffffff',
        foreground: '#0a0a0a',
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#737373',
        },
        accent: '#fef3c7',
        border: '#e5e5e5',
      },
    },
  },
  plugins: [],
}
