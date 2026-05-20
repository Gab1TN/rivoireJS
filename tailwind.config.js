/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wire: {
          page: '#efefef',
          card: '#ffffff',
          soft: '#f4f4f4',
          text: '#1f1f1f',
          muted: '#555555',
          border: '#cfcfcf',
          disabled: '#e2e2e2',
          danger: '#dcdcdc'
        }
      }
    },
  },
  plugins: [],
}
