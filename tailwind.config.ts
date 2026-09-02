import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ROLCA Design System */
        rolca: {
          ink: '#17181C',
          paper: '#FFFFFF',
          'paper-soft': '#F7F7F8',
          red: '#A6182A',
          'red-strong': '#7D1220',
          'red-soft': '#FBEAEC',
          graphite: '#5A5E68',
          silver: '#C7CBD1',
          success: '#1F8A54',
          warning: '#B8791A',
          danger: '#C0392B',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["'Inter'", 'system-ui', 'sans-serif'],
        display: ["'Sora'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.25rem', { lineHeight: '1.5' }],
        'xl': ['1.5rem', { lineHeight: '1.3' }],
        '2xl': ['2rem', { lineHeight: '1.2' }],
        '3xl': ['2.5rem', { lineHeight: '1.15' }],
      },
      boxShadow: {
        'rolca': '0 1px 2px rgba(23,24,28,0.04), 0 8px 24px rgba(23,24,28,0.06)',
        'rolca-sm': '0 1px 2px rgba(23,24,28,0.04)',
        'rolca-lg': '0 2px 4px rgba(23,24,28,0.04), 0 16px 48px rgba(23,24,28,0.08)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
