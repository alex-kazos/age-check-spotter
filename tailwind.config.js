/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
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
        border: "hsl(213, 70%, 50%)",
        input: "hsl(213, 70%, 95%)",
        ring: "hsl(213, 70%, 40%)",
        background: "hsl(213, 100%, 95%)",
        foreground: "hsl(213, 70%, 15%)",
        primary: {
          DEFAULT: "hsl(213, 70%, 50%)",
          foreground: "hsl(213, 100%, 98%)",
        },
        secondary: {
          DEFAULT: "hsl(213, 30%, 90%)",
          foreground: "hsl(213, 70%, 15%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84.2%, 60.2%)",
          foreground: "hsl(213, 100%, 98%)",
        },
        muted: {
          DEFAULT: "hsl(213, 30%, 90%)",
          foreground: "hsl(213, 70%, 40%)",
        },
        accent: {
          DEFAULT: "hsl(213, 70%, 80%)",
          foreground: "hsl(213, 70%, 15%)",
        },
        popover: {
          DEFAULT: "hsl(213, 100%, 98%)",
          foreground: "hsl(213, 70%, 15%)",
        },
        card: {
          DEFAULT: "hsl(213, 100%, 98%)",
          foreground: "hsl(213, 70%, 15%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
