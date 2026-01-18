/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './lib/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          coral: 'var(--color-brand-coral)',
          crema: 'var(--color-brand-crema)',
          dark: 'var(--color-brand-dark)',
          soft: 'var(--color-brand-soft)',
          border: 'var(--color-brand-border)',
          verde: '#22C55E',
        }
      },
      borderRadius: {
        'premium': 'var(--radius-premium)',
      },
      boxShadow: {
        'premium': 'var(--shadow-premium)',
        'deep': 'var(--shadow-deep)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
export default config;
