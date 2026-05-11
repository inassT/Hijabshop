/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        babyPink: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          DEFAULT: '#F8BBD0',
          400: '#F8BBD0',
          500: '#f43f5e',
        },
        pastelPink: {
          DEFAULT: '#FCE4EC',
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
        },
        nudeBeige: {
          DEFAULT: '#F5E6DA',
          50: '#faf7f5',
          100: '#f5f0ed',
          200: '#ebe1d9',
        },
        luxury: {
          gold: '#D4AF37',
          silver: '#C0C0C0',
          black: '#1A1A1A',
          white: '#FFFFFF',
        },
        status: {
          waiting: '#FEF3C7', // Jaune pastel
          confirmed: '#DBEAFE', // Bleu pastel
          preparing: '#FFEDD5', // Orange nude
          shipped: '#F3E8FF', // Violet pastel
          delivered: '#DCFCE7', // Vert pastel
          cancelled: '#FEE2E2', // Rouge pastel
        },
        whiteSoft: "#FFFFFF",
        darkText: "#2D3436",
        primary: "#F8BBD0",
        secondary: "#FCE4EC",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(248, 187, 208, 0.15)',
        'soft': '0 10px 40px -10px rgba(248, 187, 208, 0.3)',
        'glass': '0 8px 32px 0 rgba(248, 187, 208, 0.1)',
        'button': '0 4px 15px rgba(248, 187, 208, 0.4)',
        'hover': '0 8px 25px rgba(248, 187, 208, 0.5)',
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #F8BBD0 0%, #FCE4EC 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)',
      }
    },
  },
  plugins: [],
}

