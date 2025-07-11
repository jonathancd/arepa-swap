import type { Config } from "tailwindcss";

const config: Config = {
  // Para soportar modo oscuro controlado por clase `.dark`
  darkMode: "class",

  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{css,scss}"],
  theme: {
    borderRadius: {
      DEFAULT: "var(--radius)",
      sm: "calc(var(--radius) - 4px)",
      md: "calc(var(--radius) - 2px)",
      lg: "var(--radius)",
      xl: "calc(var(--radius) + 4px)",
      full: "9999px",
    },
    colors: {
      foreground: "var(--foreground)",
      // background: "var(--background)",
      surface: "var(--surface)",
      // primary: "var(--primary)",
    },
    extend: {
      fontSize: {},
    },
  },

  plugins: [require("tailwindcss-animate")],
};

export default config;
