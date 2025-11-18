/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0057e6',
          600: '#0044b3',
          700: '#003180',
          800: '#001f4d',
          900: '#000c1a',
        },
        secondary: {
          50: '#fff5e6',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa31a',
          500: '#ff8f00',
          600: '#cc7200',
          700: '#995600',
          800: '#663900',
          900: '#331d00',
        },
        tigo: {
          blue: '#0057e6',
          lightBlue: '#4d94ff',
          darkBlue: '#003180',
          orange: '#ff8f00',
          gray: '#f5f7fa',
        }
      },
      fontFamily: {
        'sans': ['System'],
      },
    },
  },
  plugins: [],
}