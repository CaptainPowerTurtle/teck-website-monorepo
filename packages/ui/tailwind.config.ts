import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

const config = {
  content: [
    "./src/**/*.{ts,tsx,md,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../apps/web/src/**/*.{ts,tsx,md,mdx}",
    "../../apps/storybook/src/**/*.{ts,tsx,md,mdx}",
    "../../apps/storybook/.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  presets: [sharedConfig],
} satisfies Config;

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
export default config;
