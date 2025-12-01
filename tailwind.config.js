/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      // Brutalist Surf Zine Color Palette
      colors: {
        // Core
        ink: '#0a0a0a',
        paper: '#f5f2eb',
        // Accent
        coral: '#ff6b4a',
        'coral-dark': '#e55a3a',
        ocean: '#0066cc',
        'ocean-dark': '#004d99',
        foam: '#e8f4f8',
        sand: '#d4c5a9',
        // Semantic
        trust: '#22c55e',
        'trust-dark': '#16a34a',
        distrust: '#ef4444',
        'distrust-dark': '#dc2626',
        warning: '#f59e0b',
      },

      // Typography
      fontFamily: {
        // Headlines - Condensed, punchy
        display: ['Bebas Neue', 'Impact', 'sans-serif'],
        // Body - Clean geometric
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        // Mono for data
        mono: ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        // Massive headlines for manifesto statements
        'display-xl': ['clamp(3rem, 10vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 8vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.75rem, 5vw, 3rem)', { lineHeight: '1', letterSpacing: '0' }],
      },

      // Custom border widths for brutalist cards
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px',
      },

      // Box shadows with hard edges
      boxShadow: {
        'brutal': '4px 4px 0 0 #0a0a0a',
        'brutal-sm': '2px 2px 0 0 #0a0a0a',
        'brutal-lg': '6px 6px 0 0 #0a0a0a',
        'brutal-coral': '4px 4px 0 0 #ff6b4a',
        'brutal-ocean': '4px 4px 0 0 #0066cc',
      },

      // Animation
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 45s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'stamp': 'stamp 0.3s ease-out forwards',
      },

      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        stamp: {
          '0%': { transform: 'scale(1.5) rotate(-15deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(-6deg)', opacity: '1' },
        },
      },

      // Background patterns via CSS
      backgroundImage: {
        'halftone': `radial-gradient(circle, #0a0a0a 1px, transparent 1px)`,
        'diagonal-lines': `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          #0a0a0a08 10px,
          #0a0a0a08 11px
        )`,
        'wave-pattern': `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%230a0a0a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      },
      backgroundSize: {
        'halftone': '8px 8px',
      },
    },
  },
  plugins: [],
}