/** @type {import("prettier").Options} */
const config = {
  arrowParens: 'always',
  bracketSpacing: true,
  bracketSameLine: false,
  printWidth: 80,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  plugins: [
    require('prettier-plugin-tailwindcss'),
    require('prettier-plugin-twin.macro'),
  ],
}

module.exports = config
