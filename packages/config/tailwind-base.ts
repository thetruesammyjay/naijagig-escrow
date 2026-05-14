import type { Config } from "tailwindcss";

export const tailwindBase = {
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				brand: {
					50: "#eef6ff",
					100: "#d9e9ff",
					200: "#b7d5ff",
					300: "#87bcff",
					400: "#4e9bff",
					500: "#1f7cf0",
					600: "#1665cb",
					700: "#1550a3",
					800: "#174482",
					900: "#183a6a",
					950: "#10233f"
				},
				surface: {
					DEFAULT: "#ffffff",
					muted: "#f8fafc",
					subtle: "#e2e8f0"
				}
			},
			boxShadow: {
				soft: "0 24px 60px -28px rgba(15, 23, 42, 0.35)",
				glow: "0 0 0 1px rgba(255, 255, 255, 0.08), 0 24px 64px -24px rgba(31, 124, 240, 0.35)"
			},
			borderRadius: {
				xl: "1rem",
				"2xl": "1.5rem",
				"3xl": "2rem"
			}
		}
	}
} satisfies Config;

export default tailwindBase;
