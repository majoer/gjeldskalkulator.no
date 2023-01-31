import { Roboto } from "@next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

let rootElement = undefined;
if (typeof window === "object") {
  rootElement = document != null ? document.getElementById("__next") : undefined;
}

export const THEME_PRIMARY = "rgb(12 74 110)";
export const THEME_SECONDARY = "rgb(156 39 176)";

const theme = createTheme({
  palette: {
    primary: {
      main: THEME_PRIMARY,
    },
    secondary: {
      main: THEME_SECONDARY,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: "2.4rem",
    },
  },
  breakpoints: {
    values: {
      // https://tailwindcss.com/docs/responsive-design
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  components: {
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
  },
});

theme.typography.h1 = {
  ...theme.typography.h1,
  [theme.breakpoints.up("md")]: {
    fontSize: "4rem",
  },
};

export default theme;
