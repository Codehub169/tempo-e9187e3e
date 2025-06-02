/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#3B82F6',        // Blue
        'primary-light': '#60A5FA', // Light Blue (derived from secondary in plan)
        accent: '#EC4899',          // Pink
        neutral: {
          'white': '#FFFFFF',
          'light-gray': '#F9FAFB',
          'medium-gray': '#E5E7EB',
          'dark-gray': '#1F2937',
          'black': '#000000',
        },
        feedback: {
          success: '#10B981', // Green
          warning: '#F59E0B', // Orange
          error: '#EF4444',   // Red
        },
      },
      borderRadius: {
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem', // 6px
        'lg': '0.5rem',    // 8px
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
