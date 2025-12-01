import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
  	container: {
  		center: true,
  		padding: {
  			DEFAULT: '1rem',
  			sm: '1.5rem',
  			lg: '2rem',
  			xl: '2.5rem',
  			'2xl': '3rem'
  		},
  		screens: {
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1536px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			primary: [
  				'Pinar',
  				'Vazirmatn',
  				'Tahoma',
  				'Arial',
  				'sans-serif'
  			],
  			secondary: [
  				'Inter',
  				'SF Pro',
  				'Helvetica Neue',
  				'sans-serif'
  			],
  			display: [
  				'Pinar',
  				'Vazirmatn',
  				'sans-serif'
  			]
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'50': '#F3E8FF',
  				'100': '#E9D5FF',
  				'200': '#D8B4FE',
  				'300': '#C084FC',
  				'400': '#A855F7',
  				'500': '#8B4FB8',
  				'600': '#6B2E9E',
  				'700': '#581C87',
  				'800': '#3D1A5F',
  				'900': '#2D1349',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				'50': '#FFF1F2',
  				'100': '#FFE4E6',
  				'200': '#FECDD3',
  				'300': '#FDA4AF',
  				'400': '#FB7185',
  				'500': '#FF1493',
  				'600': '#E91E8C',
  				'700': '#D81B60',
  				'800': '#BE185D',
  				'900': '#9F1239',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			info: {
  				'50': '#ECFEFF',
  				'100': '#CFFAFE',
  				'200': '#A5F3FC',
  				'300': '#67E8F9',
  				'400': '#22D3EE',
  				'500': '#00CED1',
  				'600': '#00B8D4',
  				'700': '#0891B2',
  				'800': '#0E7490',
  				'900': '#155E75'
  			},
  			neon: {
  				pink: '#FF1493',
  				purple: '#8B4FB8',
  				cyan: '#00CED1',
  				orange: '#FFA500'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
}
