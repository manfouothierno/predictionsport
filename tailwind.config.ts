import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";
import colors from "tailwindcss/colors";

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#532020',
          50: '#fdf6f6',
          100: '#f9e8e8',
          200: '#f3d1d1',
          300: '#e8adad',
          400: '#d87f7f',
          500: '#c45757',
          600: '#a93d3d',
          700: '#8b2f2f',
          800: '#6f2626',
          900: '#532020',
          950: '#3a1616',
        },
        secondary: colors.gray[600],
        success: colors.green[500],
        warning: colors.yellow[500],
        error: colors.red[500],
        background: {
          DEFAULT: colors.gray[50],
          dark: colors.gray[900]
        }
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "system-ui", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "monospace"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-in': 'slideIn 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      }
    }
  },
  darkMode: 'class',
  plugins: [
    nextui(),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
} satisfies Config;
