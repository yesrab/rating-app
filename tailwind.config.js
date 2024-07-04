/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/client/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        loginGradient: "linear-gradient(96deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
      },
      colors: {
        tgOrange: "#ef5429",
      },
      fontFamily: {
        cinacav: ["CDM", "Consolas"],
      },
      transform: {
        modalCenter: "translate(-50%, -50%);",
      },
    },
  },
  plugins: [],
};
