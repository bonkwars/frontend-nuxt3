// tailwind.config.js
module.exports = {
    theme: {
      extend: {
        colors: {
          // Degen4Life brand colors
          degen: {
            primary: '#00ff9d',    // Neon green
            secondary: '#00ccff',  // Bright cyan
            accent: '#ff00ff',     // Neon magenta
            dark: '#1a1a1a',       // Deep gray
            light: '#f0f0f0'       // Light gray
          }
        },
        backgroundImage: {
          'gradient-degen': 'linear-gradient(to right, var(--tw-gradient-stops))',
        },
        gradientColorStops: {
          'degen-start': '#00ff9d',
          'degen-end': '#00ccff',
        },
        fontFamily: {
          'degen': ['Space Grotesk', 'sans-serif']
        },
        animation: {
          'glow': 'glow 2s ease-in-out infinite alternate',
        },
        keyframes: {
          glow: {
            'from': { 'text-shadow': '0 0 10px #00ff9d, 0 0 20px #00ff9d' },
            'to': { 'text-shadow': '0 0 20px #00ccff, 0 0 30px #00ccff' }
          }
        }
      }
    },
    plugins: [],
    darkMode: 'class'
  }