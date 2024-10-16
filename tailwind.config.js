const { green } = require('@radix-ui/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...green,
      },
    },
  },
  plugins: [],
}
