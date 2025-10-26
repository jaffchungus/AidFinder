import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-bg": "linear-gradient(to right, #3b82f6, #a855f7, #6366f1)",
      },
    },
  },
  plugins: [],
};
export default config;
