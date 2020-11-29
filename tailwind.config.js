const colors = require('tailwindcss/colors')

module.exports = {
  // purge: {
  //   content: ['./src/*.ts', './src/*.tsx'],
  //   options: {
  //     whitelist: ['bg-color-500'],
  //   },
  // },
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
