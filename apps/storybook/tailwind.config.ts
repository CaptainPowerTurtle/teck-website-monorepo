import path from 'node:path';
import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Config = {
  presets: [sharedConfig],
  content: [
    "./app/**/*.tsx",
    path.join(__dirname, '**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, '.storybook/**/*.{js,ts,jsx,tsx,mdx}'),
  ],
};

export default config;