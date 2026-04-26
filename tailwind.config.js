/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          850: "#172033",
          950: "#0B1120",
        },
      },
    },
  },
  plugins: [],
};
