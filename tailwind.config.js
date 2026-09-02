module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Plain white page canvas (see --page-bg in globals.css) */
        canvas: 'rgb(255 255 255)',
      },
    },
  },
  plugins: [],
};