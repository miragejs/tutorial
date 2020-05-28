const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      minWidth: {
        md: "28rem",
      },
    },
  },
  variants: {
    display: ["responsive", "group-hover"],
    visibility: ["responsive", "group-hover"],
  },
  plugins: [require("@tailwindcss/ui")],
};
