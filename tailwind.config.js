/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
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
        gold: "#f9bc2e",
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
  plugins: [
    //  Custom variant plugin for `max-sm:`
    function ({ addVariant }) {
      addVariant("max-sm", "@media (max-width: 639px)");
      addVariant("max-md", "@media (max-width: 767px)");
      addVariant("max-lg", "@media (max-width: 1023px)");
      addVariant("max-xl", "@media (max-width: 1279px)");
      addVariant("max-2xl", "@media (max-width: 1535px)");

      // between-* variants (range between two breakpoints)
      addVariant(
        "between-sm-md",
        "@media (min-width: 640px) and (max-width: 767px)"
      );
      addVariant(
        "between-md-lg",
        "@media (min-width: 768px) and (max-width: 1023px)"
      );
      addVariant(
        "between-lg-xl",
        "@media (min-width: 1024px) and (max-width: 1279px)"
      );
      addVariant(
        "between-xl-2xl",
        "@media (min-width: 1280px) and (max-width: 1535px)"
      );
    },
  ],
});
