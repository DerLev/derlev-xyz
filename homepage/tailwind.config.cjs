/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
    './app/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        text: {
          100: '#fafafa',
          300: '#bbbbbb',
          500: '#7d7d7d',
          900: '#050505',
        },
        background: {
          dark: '#050505',
          light: '#fafafa',
        },
        primary: {
          50: '#f1e6ff',
          100: '#d4b3ff',
          200: '#b780fe',
          300: '#9a4dfe',
          400: '#7d1bfe',
          500: '#6c01f9',
          600: '#4d01b2',
          700: '#37017f',
          800: '#21004c',
          900: '#0b0019',
        },
        secondary: {
          400: '#262626',
          500: '#171717',
        },
        accent: {
          50: '#e7fef5',
          100: '#b6fce0',
          200: '#85facb',
          300: '#54f8b6',
          400: '#23f6a1',
          500: '#0aea90',
          600: '#07ab6a',
          700: '#057a4b',
          800: '#03492d',
          900: '#01180f',
        },
      },
      aspectRatio: {
        '19/6': '16 / 6',
        '16/9': '16 / 9',
      },
    },
    fontFamily: {
      display: ['"Space Grotesk"', 'sans-serif'],
      body: ['"Space Grotesk"', 'sans-serif'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

