import type { Config } from "tailwindcss"

const config = {
    darkMode: "class",
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                brand: {
                    green: "#17A546",
                    dark: "#070D17",
                    navy: "#030E36",
                    gold: "#DEAB06",
                },
                neutral: {
                    100: "#F7F9FC",
                    200: "#F0F2F5",
                    300: "#98A2B3",
                    400: "#D0D5DD",
                    600: "#F9F9F9",
                    700: "#F2F2F2",
                    800: "#ECECEC",
                    900: "#E5E5E5",
                    base: "#98A2B3",
                },
                semantic: {
                    success: {
                        dark: "#0E7B33",
                        main: "#40B869",
                        support: "#E7F6EC",
                    },
                    warning: {
                        dark: "#F5B546",
                        main: "#F5B546",
                        support: "#FEF6E7",
                    },
                    error: {
                        dark: "#940803",
                        main: "#DD524D",
                        support: "#FBEAE9",
                    },
                    info: {
                        main: "#4A85E4",
                        support: "#F2FAFF",
                    }
                },
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
            },
            fontFamily: {
                sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
            },
            fontSize: {
                'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
                'h2': ['36px', { lineHeight: '1.3', fontWeight: '600' }],
                'h3': ['28px', { lineHeight: '1.4', fontWeight: '600' }],
                'body-lg': ['18px', { lineHeight: '1.6' }],
                'body': ['16px', { lineHeight: '1.6' }],
                'sm': ['14px', { lineHeight: '1.5' }],
                'caption': ['12px', { lineHeight: '1.5' }],
            },
            spacing: {
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                'xxl': '48px',
            },
            borderRadius: {
                'none': '0',
                'sm': '4px',
                DEFAULT: '8px',
                'md': '12px', // Buttons, Inputs
                'lg': '16px', // Cards
                'xl': '20px', // Modals
                'full': '9999px',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
