/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				bg: "rgb(var(--bg) / <alpha-value>)",
				card: "rgb(var(--card) / <alpha-value>)",
				text: "rgb(var(--text) / <alpha-value>)",
				muted: "rgb(var(--muted) / <alpha-value>)",
				primary: "rgb(var(--primary) / <alpha-value>)",
				accent: "rgb(var(--accent) / <alpha-value>)",
				orangeBrand: "rgb(var(--orange) / <alpha-value>)",
				greenBrand: "rgb(var(--green) / <alpha-value>)",
			},
			boxShadow: {
				soft: "0 6px 24px rgba(0,0,0,.08)",
			},
			borderRadius: {
				xl2: "1rem",
			},
		},
	},
	plugins: [],
}

