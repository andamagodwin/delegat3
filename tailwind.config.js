/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fffef7',
          100: '#fffbeb',
          200: '#fff4c6',
          300: '#ffeb91',
          400: '#ffdc54',
          500: '#FDBA12',
          600: '#f4a30b',
          700: '#d1830b',
          800: '#a86710',
          900: '#8a5511',
          950: '#4e2e05',
        },
        unlock: '#FDBA12',
      },
    },
  },
  plugins: [],
}

