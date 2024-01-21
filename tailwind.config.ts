import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        textSecondary: '#535353',
      },
      backgroundColor: {
        hover: 'rgba(0,0,0,.07)'
      },
      boxShadow: {
        sxl: '0 0 8px #eee, 1px 0 3px #0000001a, -1px 0 3px #0000001a'
      }
    },
  },
  plugins: [],
}
export default config
