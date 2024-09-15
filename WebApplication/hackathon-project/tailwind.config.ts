import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        typewriter: {
          '0%': { width: '0%', borderRight: '0.15em solid #000' },
          '100%': { width: '100%', borderRight: '0.15em solid transparent' },
        },
        bounceIn: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-30px)' },
          '60%': { transform: 'translateY(-15px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      },
      animation: {
        'popIn': 'popIn 0.5s ease-out forwards',
        'fadeIn': 'fadeIn 0.8s ease-out 0.3s forwards',
        'scaleIn': 'scaleIn 0.7s ease-out 0.6s forwards',
        'slideDown': 'slideDown 1s ease-out forwards',
        'typewriter': 'typewriter 4s steps(40) 1s forwards',
        'bounceIn': 'bounceIn 1s ease-out 0.5s both',
        'blink': 'blink 0.7s infinite',
      }
    },
  },
  variants: {},
  plugins: [],
};
export default config;
