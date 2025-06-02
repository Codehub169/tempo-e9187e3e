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
        primary: {
          light: '#60A5FA',   // Example: blue-400
          DEFAULT: '#3B82F6', // Example: blue-500. For classes like bg-primary, text-primary.
          500: '#3B82F6',     // Explicitly for 'primary-500' suffixed classes, same as DEFAULT.
          600: '#2563EB',     // Example: blue-600. For classes like 'primary-600'.
        },
        accent: '#EC4899',          // Example: Pink
        neutral: {
          'white': '#FFFFFF',
          'light-gray': '#F9FAFB',    // Example: Tailwind gray-50
          'medium-gray': '#E5E7EB', // Example: Tailwind gray-200
          'dark-gray': '#1F2937',     // Example: Tailwind gray-800
          'black': '#000000',
        },
        feedback: {
          success: '#10B981', // Example: Green
          warning: '#F59E0B', // Example: Orange
          error: '#EF4444',   // Example: Red
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
