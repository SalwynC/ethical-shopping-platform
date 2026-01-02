import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#deebff',
          200: '#bfd7ff',
          300: '#8fb7ff',
          400: '#5d94ff',
          500: '#366ff2',
          600: '#2054d6',
          700: '#153cac',
          800: '#123383',
          900: '#142f68',
        },
        success: '#1AA251',
        warning: '#FFB020',
        danger: '#D92D20',
      },
      boxShadow: {
        focus: '0 0 0 3px rgba(54, 111, 242, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
