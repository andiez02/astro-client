
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'], 
        display: ['var(--font-poppins)'], 
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        primary: '#6C5DD3',
        secondary: '#00D1FF',
      },

    },
  },
  plugins: [],
};
export default config;