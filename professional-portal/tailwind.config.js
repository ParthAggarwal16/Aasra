/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#782c00",
        "primary-container": "#9e3d00",
        secondary: "#006b58",
        "secondary-container": "#9ef3da",
        tertiary: "#623c00",
        "tertiary-fixed": "#ffddb9",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        background: "#fef8f3",
        surface: "#fef8f3",
        "surface-container": "#f3ede8",
        "surface-container-low": "#f8f3ee",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#ede7e2",
        "surface-container-highest": "#e7e1dd",
        "on-background": "#1d1b19",
        "on-surface": "#1d1b19",
        "on-surface-variant": "#574239",
        "outline-variant": "#e0c0b2",
        outline: "#8a7268",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#10715e",
        "on-error-container": "#93000a",
        "on-tertiary-fixed": "#2b1700",
        "primary-fixed-dim": "#ffb595",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      fontFamily: {
        "headline-lg": ["Atkinson Hyperlegible Next", "sans-serif"],
        "body-md": ["Atkinson Hyperlegible Next", "sans-serif"],
        "nav-label": ["Inter", "sans-serif"],
        "label-caps": ["Inter", "sans-serif"],
      },
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
};
