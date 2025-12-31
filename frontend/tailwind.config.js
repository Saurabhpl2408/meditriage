/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          foreground: '#ffffff',
        },
        emergency: {
          DEFAULT: '#DC2626',
          foreground: '#ffffff',
        },
        urgent: {
          DEFAULT: '#F59E0B',
          foreground: '#ffffff',
        },
        'non-urgent': {
          DEFAULT: '#0891B2',
          foreground: '#ffffff',
        },
        safe: {
          DEFAULT: '#059669',
          foreground: '#ffffff',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-emergency': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(220 38 38 / 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgb(220 38 38 / 0)' },
        },
        'recording': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
        'waveform': {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'progress': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'pulse-emergency': 'pulse-emergency 1.5s ease-in-out infinite',
        'recording': 'recording 1.5s ease-in-out infinite',
        'waveform': 'waveform 1s ease-in-out infinite',
        'progress': 'progress 1s ease-out',
      },
    },
  },
  plugins: [],
}