/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-tertiary-fixed-variant": "#663e00",
        "on-secondary": "#ffffff",
        "surface-variant": "#e7e1dd",
        "on-tertiary-fixed": "#2b1700",
        "on-error": "#ffffff",
        "primary-fixed": "#ffdbcd",
        "tertiary": "#623c00",
        "surface-container-lowest": "#ffffff",
        "tertiary-container": "#835100",
        "error": "#ba1a1a",
        "surface-tint": "#a24003",
        "inverse-on-surface": "#f6f0eb",
        "surface-bright": "#fef8f3",
        "inverse-surface": "#32302d",
        "on-secondary-container": "#10715e",
        "secondary-container": "#8bf2d6",
        "surface-dim": "#ded9d4",
        "secondary-fixed-dim": "#83d6bf",
        "surface-container-low": "#f8f3ee",
        "on-tertiary-container": "#ffcb90",
        "on-background": "#1d1b19",
        "tertiary-fixed-dim": "#fdb966",
        "surface-container-high": "#ede7e2",
        "on-secondary-fixed": "#002019",
        "outline": "#8a7268",
        "on-primary": "#ffffff",
        "primary": "#782c00",
        "secondary": "#006b58",
        "surface-container": "#f3ede8",
        "on-surface": "#1d1b19",
        "background": "#fef8f3",
        "on-primary-container": "#ffc9b2",
        "tertiary-fixed": "#ffddb9",
        "on-primary-fixed": "#351000",
        "surface": "#fef8f3",
        "on-secondary-fixed-variant": "#005142",
        "primary-fixed-dim": "#ffb595",
        "error-container": "#ffdad6",
        "outline-variant": "#dec0b5",
        "on-error-container": "#93000a",
        "on-surface-variant": "#594238",
        "on-tertiary": "#ffffff",
        "inverse-primary": "#ffb595",
        "on-primary-fixed-variant": "#7c2e00",
        "surface-container-highest": "#e7e1dd",
        "primary-container": "#9e3d00",
        "secondary-fixed": "#9ef3da"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "touch-target-min": "56px",
        "gutter": "16px",
        "unit": "8px",
        "stack-gap": "20px",
        "container-padding": "24px"
      },
      fontFamily: {
        "headline-lg-mobile": ["Atkinson Hyperlegible Next", "sans-serif"],
        "body-md": ["Atkinson Hyperlegible Next", "sans-serif"],
        "body-lg": ["Atkinson Hyperlegible Next", "sans-serif"],
        "hindi-body": ["Inter", "sans-serif"],
        "headline-lg": ["Atkinson Hyperlegible Next", "sans-serif"],
        "label-caps": ["Inter", "sans-serif"],
        "headline-md": ["Atkinson Hyperlegible Next", "sans-serif"],
        "nav-label": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-lg-mobile": [
          "26px",
          {
            "lineHeight": "32px",
            "fontWeight": "700"
          }
        ],
        "body-md": [
          "18px",
          {
            "lineHeight": "28px",
            "fontWeight": "400"
          }
        ],
        "body-lg": [
          "20px",
          {
            "lineHeight": "30px",
            "fontWeight": "400"
          }
        ],
        "hindi-body": [
          "20px",
          {
            "lineHeight": "34px",
            "fontWeight": "400"
          }
        ],
        "headline-lg": [
          "32px",
          {
            "lineHeight": "40px",
            "letterSpacing": "-0.02em",
            "fontWeight": "700"
          }
        ],
        "label-caps": [
          "14px",
          {
            "lineHeight": "20px",
            "letterSpacing": "0.05em",
            "fontWeight": "600"
          }
        ],
        "headline-md": [
          "24px",
          {
            "lineHeight": "32px",
            "fontWeight": "700"
          }
        ],
        "nav-label": [
          "12px",
          {
            "lineHeight": "16px",
            "fontWeight": "600"
          }
        ]
      }
    },
  },
  plugins: [],
}
