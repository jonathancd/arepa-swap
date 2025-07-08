import type { Config } from "tailwindcss";

const config: Config = {
  // Para soportar modo oscuro controlado por clase `.dark`
  darkMode: "class",

  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  theme: {
    borderRadius: {
      DEFAULT: "var(--radius)",
      sm: "calc(var(--radius) - 4px)",
      md: "calc(var(--radius) - 2px)",
      lg: "var(--radius)",
      xl: "calc(var(--radius) + 4px)",
      full: "9999px", // opcional, por si usas rounded-full
    },
    extend: {
      // Aquí va el resto de tu extend (colors, spacing, etc.)
    },
  },

  plugins: [],
};

export default config;
