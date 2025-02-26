import type { Config } from "tailwindcss";
import svgToDataUri from "mini-svg-data-uri";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    animation: {
      move: "move 5s linear infinite",
    },
    keyframes: {
      move: {
        "0%": { transform: "translateX(-200px)" },
        "100%": { transform: "translateX(200px)" },
      },
    },
  },
  plugins: [
    animate,
    typography,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
} satisfies Config;

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
export default config;
