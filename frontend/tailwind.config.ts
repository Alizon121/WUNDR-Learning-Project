import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
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
