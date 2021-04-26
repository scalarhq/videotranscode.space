const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['**/*.tsx', './src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        background: '#17141d',
        isabeline: '#EEE2DF',
        default: '#10B981',
        modalBg: 'rgb(43, 44, 54)',
        orange: colors.orange
      }
    }
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')]
}
