import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
              "bandung-putih": "#FFFFFF",
              "on-surface-variant": "#3f4a3e",
              "background": "#fcf9f8",
              "surface-container-high": "#eae7e7",
              "on-primary-container": "#a1ffad",
              "on-primary": "#ffffff",
              "outline": "#6f7a6d",
              "bandung-biru": "#005CB9",
              "surface-dim": "#dcd9d9",
              "secondary-container": "#fecb00",
              "surface": "#fcf9f8",
              "surface-container-lowest": "#ffffff",
              "tertiary-fixed": "#d7e3ff",
              "surface-container": "#f0eded",
              "inverse-on-surface": "#f3f0ef",
              "bandung-kuning": "#FFCC00",
              "surface-bright": "#fcf9f8",
              "tertiary-fixed-dim": "#aac7ff",
              "on-tertiary-fixed": "#001b3e",
              "secondary-fixed-dim": "#f1c100",
              "inverse-surface": "#313030",
              "surface-tint": "#006e2d",
              "error-container": "#ffdad6",
              "inverse-primary": "#77dc88",
              "error": "#ba1a1a",
              "on-secondary": "#ffffff",
              "primary-container": "#007a33",
              "on-error": "#ffffff",
              "secondary-fixed": "#ffe08b",
              "on-primary-fixed": "#002109",
              "on-surface": "#1c1b1b",
              "outline-variant": "#becabb",
              "on-tertiary-container": "#e2eaff",
              "on-primary-fixed-variant": "#005320",
              "tertiary-container": "#1e68c5",
              "primary": "#005e26",
              "on-background": "#1c1b1b",
              "bandung-hijau": "#007A33",
              "surface-container-low": "#f6f3f2",
              "surface-container-highest": "#e5e2e1",
              "secondary": "#745b00",
              "bandung-hitam": "#1A1A1A",
              "on-tertiary-fixed-variant": "#00458e",
              "tertiary": "#0050a2",
              "on-secondary-container": "#6e5700",
              "surface-variant": "#e5e2e1",
              "on-tertiary": "#ffffff",
              "on-error-container": "#93000a",
              "primary-fixed": "#93f9a2",
              "primary-fixed-dim": "#77dc88",
              "on-secondary-fixed": "#241a00",
              "on-secondary-fixed-variant": "#584400"
      },
      "borderRadius": {
              "sm": "0.25rem",
              "DEFAULT": "0.5rem",
              "md": "0.75rem",
              "lg": "1rem",
              "xl": "1.5rem",
              "2xl": "2rem",
              "3xl": "2.5rem",
              "full": "9999px"
      },
      "boxShadow": {
              "electric-green": "0 10px 25px -5px rgba(0, 122, 51, 0.4), 0 8px 10px -6px rgba(0, 122, 51, 0.1)",
              "electric-yellow": "0 10px 25px -5px rgba(255, 204, 0, 0.4), 0 8px 10px -6px rgba(255, 204, 0, 0.1)",
              "electric-black": "0 10px 25px -5px rgba(26, 26, 26, 0.3), 0 8px 10px -6px rgba(26, 26, 26, 0.1)"
      },
      "spacing": {
              "section-gap-lg": "100px",
              "section-gap-md": "64px",
              "margin-desktop": "40px",
              "margin-mobile": "16px",
              "gutter": "24px",
              "container-max": "1280px",
              "unit": "8px"
      },
      "fontFamily": {
              "body-lg": [
                      "Outfit", "sans-serif"
              ],
              "body-sm": [
                      "Outfit", "sans-serif"
              ],
              "display-lg": [
                      "Outfit", "sans-serif"
              ],
              "headline-sm": [
                      "Outfit", "sans-serif"
              ],
              "label-sm": [
                      "Outfit", "sans-serif"
              ],
              "body-md": [
                      "Outfit", "sans-serif"
              ],
              "label-caps": [
                      "Outfit", "sans-serif"
              ],
              "headline-lg": [
                      "Outfit", "sans-serif"
              ],
              "display-lg-mobile": [
                      "Outfit", "sans-serif"
              ],
              "headline-md": [
                      "Outfit", "sans-serif"
              ]
      },
      "fontSize": {
              "body-lg": ["20px", { "lineHeight": "32px", "fontWeight": "500" }],
              "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
              "display-lg": ["72px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "800" }],
              "headline-sm": ["24px", { "lineHeight": "32px", "fontWeight": "700" }],
              "label-sm": ["11px", { "lineHeight": "14px", "fontWeight": "600" }],
              "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
              "label-caps": ["12px", { "lineHeight": "16px", "letterSpacing": "0.1em", "fontWeight": "700" }],
              "headline-lg": ["48px", { "lineHeight": "56px", "fontWeight": "800" }],
              "display-lg-mobile": ["48px", { "lineHeight": "52px", "letterSpacing": "-0.02em", "fontWeight": "800" }],
              "headline-md": ["32px", { "lineHeight": "40px", "fontWeight": "700" }]
      }
    },
  },
  plugins: [],
};
export default config;