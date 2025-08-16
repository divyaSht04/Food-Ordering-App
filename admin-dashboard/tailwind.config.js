/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
        'quicksand-bold': ['Quicksand-Bold', 'sans-serif'],
        'quicksand-medium': ['Quicksand-Medium', 'sans-serif'],
        'quicksand-regular': ['Quicksand-Regular', 'sans-serif'],
        'quicksand-semibold': ['Quicksand-SemiBold', 'sans-serif'],
        'quicksand-light': ['Quicksand-Light', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          50: '#FFF4F1',
          100: '#FFE8E0',
          200: '#FFD0BF',
          300: '#FFB89E',
          400: '#FF9F7D',
          500: '#FF6B35',
          600: '#E55A2E',
          700: '#CC4927',
          800: '#B33820',
          900: '#992719',
        },
        secondary: {
          DEFAULT: '#2C2C2C',
          50: '#F7F7F7',
          100: '#E3E3E3',
          200: '#C8C8C8',
          300: '#ADADAD',
          400: '#919191',
          500: '#767676',
          600: '#5A5A5A',
          700: '#3F3F3F',
          800: '#2C2C2C',
          900: '#1A1A1A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'large': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
