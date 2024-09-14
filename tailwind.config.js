/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "/node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "/node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        gold: "linear-gradient(93.92deg, #F9BC2E 0%, #E29A1E 13.29%, #FFCD38 30.34%, #F0AF30 73.17%, #E29A1E 83.8%, #FFCD38 96.43%, #DD931A 100.4%)",
        offwhite: "background: #F5F5F5;"
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors:{
        gold: "#f9bc2e"
      },
      maxWidth: ['responsive'],
    },
  },
  plugins: [
  ],
});
