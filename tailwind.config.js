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
      width: {
        md: "28rem",
      },
    },
    customForms: (theme) => ({
      default: {
        input: {
          borderColor: theme("colors.cool-gray.300"),
          "&::placeholder": {
            color: theme("colors.cool-gray.500"),
            opacity: "1",
          },
        },
        textarea: {
          borderColor: theme("colors.cool-gray.300"),
          "&::placeholder": {
            color: theme("colors.cool-gray.500"),
            opacity: "1",
          },
        },
        multiselect: {
          borderColor: theme("colors.cool-gray.300"),
        },
        select: {
          borderColor: theme("colors.cool-gray.300"),
          iconColor: theme("colors.cool-gray.500"),
        },
        checkbox: {
          borderColor: theme("colors.cool-gray.300"),
        },
        radio: {
          borderColor: theme("colors.cool-gray.300"),
        },
      },
    }),
  },
  variants: {
    display: ["responsive", "group-hover"],
    visibility: ["responsive", "group-hover"],
  },
  plugins: [require("@tailwindcss/ui")],
};
