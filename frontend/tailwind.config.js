/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        fin: {
          ink: '#142D3D',
          inkSoft: '#1D3A4D',
          forest: '#34653B',
          forestDark: '#2F5A36',
          sage: '#A9C6AB',
          sageSoft: '#DCE9D9',
          mist: '#EFF0E7',
          paper: '#FFFFFF',
          shell: '#F8FAF4',
          line: '#DDE4DA',
          text: '#51645A',
          muted: '#718278',
          body: '#385246',
          danger: '#DC2626',
          warning: '#A16207',
        },
        warm: {
          50: '#FAF8F5',
          100: '#F5F2ED',
          200: '#EBE7E1',
          300: '#E1DDD5',
          400: '#D7D3CB',
          500: '#CCC7BD',
          600: '#A8A39E',
          700: '#84807B',
        },
        'warm-gray': {
          900: '#1F1B15',
          800: '#2D2824',
          700: '#3B3530',
          600: '#49433C',
        },
      },
      backgroundColor: {
        'app-bg': '#EFF0E7',
        'card-default': '#FFFFFF',
        'card-hover': '#F8FAF4',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(20, 45, 61, 0.08)',
        panel: '0 22px 55px rgba(20, 45, 61, 0.10)',
        lift: '0 14px 30px rgba(52, 101, 59, 0.22)',
        'card-sm': '0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'card-md': '0 2px 8px rgba(0, 0, 0, 0.07), 0 4px 12px rgba(0, 0, 0, 0.05)',
        'card-lg': '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.06)',
      },
      letterSpacing: {
        'wide-xl': '0.04em',
      },
    },
  },
  plugins: [],
}
