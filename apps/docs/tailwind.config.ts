import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";


const config: Config = {
  presets: [sharedConfig],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './theme.config.tsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class',
};

export default config;

// export * from '@repo/ui/tailwind.config'; -- Uncomment this line if you want to extend the UI package's Tailwind config and use its styles and components
