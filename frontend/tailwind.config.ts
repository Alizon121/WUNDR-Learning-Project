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
        wonderbg: '#fdf6e9', 
        // wonderbg: '#FAF7ED', 
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      screens: {
        xs: "320px",     
        sm: "425px",     
        md: "768px",
        lg: "1024px", 
        xl: "1440px",    
        xxl: "1600px",  
      },
    },
  },
  plugins: [],
}
export default config
