import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  theme: {
    extend: {
      colors: {
        background: "#121212", // Fondo principal
        surface: "#1C1C1E", // Fondo secundario
        text: "#E0E0E0", // Texto principal
        muted: "#A0A0A0", // Texto secundario
        primary: "#FFD700", // Botón / Primario
        primaryHover: "#E6C200", // Hover botón
        highlight: "#38BDF8", // Color terciario (resaltado)
        error: "#FF4C4C", // Error / Crítico
        success: "#34D399", // Éxito / Confirmación
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.2)",
      },
    },
  },

  plugins: [],
};

export default config;
