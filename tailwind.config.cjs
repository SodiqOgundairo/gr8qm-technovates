/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        skyblue: '#0098da',
        iceblue: '#c9ebfb',
        oxford: '#05235a',
        orange: '#f58634',
        dark: '#101010',
        light: '#fafafa',
        'gray-1': '#A1A1A1',
        'gray-2': '#6F6D66',
        'gray-3': '#282826'
      },
      fontFamily: {
        epilogue: ['Epilogue', 'Montserrat', 'sans-serif'],
        montserrat: ['Montserrat', 'Epilogue', 'sans-serif']
      }
    }
  },
  plugins: []
}
