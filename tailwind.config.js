const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['**/*.tsx', './src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        background: '#17141d',
        isabeline: '#EEE2DF',
        default: '#3fbd71',
        orange: colors.orange
      }
    }
  },
  variants: {},
  plugins: []
}
