/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "/node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "/node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        gold: "linear-gradient(93.92deg, #F9BC2E 0%, #E29A1E 13.29%, #FFCD38 30.34%, #F0AF30 73.17%, #E29A1E 83.8%, #FFCD38 96.43%, #DD931A 100.4%)",
        offwhite: "background: #F5F5F5;",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        gold: {
          500: "#FFD700",
          600: "#DAA520",
        },
      },
      maxWidth: ["responsive"],
      animation: {
        shimmer: "shimmer 2s linear infinite",
        marquee: "marquee var(--duration, 30s) linear infinite",
        marqueerev: "marqueerev var(--duration, 30s) linear infinite",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
        marqueerev: {
          to: { transform: "translateX(50%)" },
        },
      },
    },
  },
  plugins: [],
});
