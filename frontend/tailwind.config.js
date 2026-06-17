/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          dark: '#191414',
          black: '#121212',
          card: '#181818',
          hover: '#282828',
          textMuted: '#B3B3B3',
        },
        mood: {
          happy: '#F59E0B',    // Amber
          sad: '#3B82F6',      // Blue
          angry: '#EF4444',    // Red
          fear: '#8B5CF6',     // Purple
          surprise: '#EC4899', // Pink
          neutral: '#10B981',  // Emerald
          calm: '#06B6D4',     // Cyan
          energetic: '#84CC16' // Lime
        },
        dark: {
          bg: '#0A0C10',
          card: 'rgba(25, 30, 40, 0.45)',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(29, 185, 84, 0.25)',
        'glow-happy': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-sad': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-angry': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glow-calm': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-energetic': '0 0 20px rgba(132, 204, 22, 0.3)',
        'glow-neutral': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
