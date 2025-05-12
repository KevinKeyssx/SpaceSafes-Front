/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ebfffd',
          100: '#cefff9',
          200: '#9ffef3',
          300: '#67f4ea',
          400: '#2ce2d7',
          500: '#0ec7bd',
          600: '#07a59c',
          700: '#0a827b',
          800: '#0d6763',
          900: '#0f5552',
          950: '#003433',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#022c29',
        },
        neutral: {
          50: '#f7fafa',
          100: '#e7f3f3',
          200: '#d0e7e7',
          300: '#abd5d5',
          400: '#7eb8b8',
          500: '#5e9c9c',
          600: '#4a8080',
          700: '#3e6969',
          800: '#365858',
          900: '#2f4a4a',
          950: '#1a2e2e',
        },
        accent: {
          50: '#eefcff',
          100: '#d6f7ff',
          200: '#b5f1ff',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        }
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s infinite',
        'scale-up': 'scale-up 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out'
      }
    },
  },
  plugins: [],
}