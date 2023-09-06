import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          backgroundColor: "#E0E5EC",
          borderRadius: "18px",
          border: "white 1px solid",
        },
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "18px",
          border: "white 1px solid",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#FFF", // white
      light: "#E0E5EC", // light grey
      dark: "#A3B1C6", // dark grey
    },
    secondary: {
      main: "#136A61", // green
      light: "#428780",
    },

    text: {
      primary: "#A3B1C6",
    },
    divider: "#00000050",
  },
  typography: {
    h1: {},
    h2: {},
    h3: {},
    h4: {},
    h5: {},
    h6: {},
    body1: {},
    body2: {},
    button: {
      textTransform: "none",
    },
    caption: {},
    subtitle1: {},
    fontFamily: "'Nunito Sans', sans-serif",
  },
});
