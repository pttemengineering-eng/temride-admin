/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#1B3A6B',
        background: '#F8FAFC',
        foreground: '#1F2937',
        primary: {
          DEFAULT: '#1B3A6B',
          dark: '#152d54',
          light: '#2a4f8f',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F59E0B',
          dark: '#d97706',
          light: '#fbbf24',
          foreground: '#1B3A6B',
        },
        accent: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34d399',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: '#E2E8F0',
        border: '#E2E8F0',
      },
    },
  },
  plugins: [],
}
