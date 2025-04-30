import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1440,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: "#000",
      white: "#fff",
      error: "#d32f2f",
      dark_red: "#910F03",
      green: "#228B22",
      accent: "#ff5a23",
      hover: "#00e98d",
      background: "#000",
      dark_purple: "#371A87",
      opaque_black: "#00000080",
      opaque_white: "#FFFFFF80",
      opaque_accent: "#ff5a2380",
      light_gray: "lightgray",
      lighter_gray: "#EFEFEF",
    },
    secondary: {
      main: "#fff",
    },
  },
  // shadows: {
  //   xs: '0 1px 1px rgba(0,0,0,.08),0 0 0 1px rgba(0,0,0,.04)',
  //   sm: '4px 4px 1px rgba(0,0,0,.08),0 0 0 1px rgba(0,0,0,.04)',
  // },
  typography: {
    allVariants: {
      fontFamily: "Helvetica, sans-serif !important",
    },
  },
});

theme = createTheme(theme, {
  typography: {
    h1: {
      fontSize: "2.1rem",
      fontWeight: "600",

      [theme.breakpoints.up("md")]: {
        fontSize: "3.5rem",
      },
    },
    h2: {
      fontSize: "1.8rem",
      fontWeight: "600",

      [theme.breakpoints.up("md")]: {
        fontSize: "2.1rem",
      },
    },
    h3: {
      fontSize: "1.2rem",
      fontWeight: "600",

      [theme.breakpoints.up("md")]: {
        fontSize: "1.5rem",
      },
    },
    h3_normal: {
      ...theme.typography.allVariants,

      fontSize: "1.2rem",
      fontWeight: "normal",

      [theme.breakpoints.up("md")]: {
        fontSize: "1.5rem",
      },
    },
    product_h3: {
      ...theme.typography.allVariants,

      fontSize: "1rem",
      fontWeight: "600",

      [theme.breakpoints.up("md")]: {
        fontSize: "1.5rem",
      },
    },
    body1: {
      fontSize: "1rem",

      [theme.breakpoints.up("md")]: {
        fontSize: "1.2rem",
      },
    },
    italic_bold_body1: {
      ...theme.typography.allVariants,

      fontSize: "1rem",
      fontWeight: "600",
      fontStyle: "italic",

      [theme.breakpoints.up("md")]: {
        fontSize: "1.2rem",
      },
    },
    bold_body1: {
      ...theme.typography.allVariants,

      fontSize: "1rem",
      fontWeight: "600",

      [theme.breakpoints.up("md")]: {
        fontSize: "1.2rem",
      },
    },
    product_body1: {
      ...theme.typography.allVariants,

      fontSize: ".9rem",

      [theme.breakpoints.up("md")]: {
        fontSize: "1.2rem",
      },
    },
    body2: {
      fontSize: ".9rem",

      [theme.breakpoints.up("md")]: {
        fontSize: "1.1rem",
      },
    },
  },
  // Here we override MUI components default styles
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h3_normal: "h3",
          product_h3: "h3",
          italic_bold_body1: "p",
          bold_body1: "p",
          product_body1: "p",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: "1.7rem",
          height: "1.7rem",

          fill: theme.palette.primary.accent,
        },
        colorDisabled: {
          fill: theme.palette.primary.light_gray,
        },
      },
    },
  },
});

export default theme;
