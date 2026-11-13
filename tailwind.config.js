/** @type {import('tailwindcss').Config} */
// Built at compile time (was the Play CDN in index.html)
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif TC"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Noto Sans TC"', 'system-ui', 'sans-serif'],
        // the rounded face of the "How EhYo fits you" sentence
        rounded: ['"Nunito"', '"Huninn"', '"M PLUS Rounded 1c"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ehyo: {
          bg: '#FBFAF6',
          text: '#2D2A26',
          coral: '#FF8FAB',
          indigo: '#6B7FD7',
          sage: '#A3B18A',
          dark: '#1a1a1a',
        },
      },
      // Brand indigo as text is a step deeper so small type stays readable (5.2:1 on the page cream);
      // fills, bars and borders keep the brand value above.
      textColor: {
        ehyo: { indigo: '#4F62C2' },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(40px)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-40px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
