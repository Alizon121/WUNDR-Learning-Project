import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        wondergreen: '#2f5d3e',
        wonderleaf: '#90b35c',
        wonderorange: '#f5a940',
        wondersun: '#fbd78d',
        // wonderbg: '#fdf6e9', 
        wonderbg: '#FAF7ED', 
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        segoe: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      screens: {
        xs: "320px",     
        sm: "425px",     
        md: "768px",
        lg: "1024px", 
        xl: "1440px",    
        xxl: "1600px",  
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(20px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(40px)' },
        },
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
