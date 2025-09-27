import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    customComponents: {
      orderSummary: {
        height: number;
      };
    };
  }

  interface ThemeOptions {
    customComponents?: {
      orderSummary?: {
        height?: number;
      };
    };
  }
}

const breakpointsTheme = createTheme();

const theme = createTheme({
  breakpoints: {
    values: {
      ...breakpointsTheme.breakpoints.values,
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1300,
      xl: 1536,
    },
  },
  palette: {
    mode: "light",
    primary: { main: "#121F56", light: "#3C81DB", dark: "#121F56" },
    secondary: { main: "#1DB3D1", light: "#B3EFFF", dark: "#052550" },
    text: { primary: "#232323", secondary: "#7B7B7B" },
    background: { default: "#F3F8FF" },
    divider: "#A7A7A7",
    error: { main: "#D32F2F", light: "#F5D7D7", dark: "#C62828" },
    warning: { main: "#ED6C02", light: "#FF9800" },
    success: { main: "#2E7D32", light: "#4CAF50", dark: "#1B5E20" },
    info: { main: "#0288D1", light: "#03A9F4", dark: "#01579B" },
  },
  typography: {
    h1: {
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 500,
      fontSize: "22px",
      lineHeight: "28px",
      [breakpointsTheme.breakpoints.up("md")]: {
        fontSize: "36px",
        fontWeight: 300,
        lineHeight: "46px",
      },
    },
    h2: {
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 300,
      fontSize: "38px",
      lineHeight: "52px",
    },
    h3: {
      fontFamily: "Poppins, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 500,
      fontSize: "26px",
      lineHeight: "32px",
    },
    h4: {
      fontFamily: "Poppins, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 600,
      fontSize: "24px",
      lineHeight: "28px",
    },
    h5: {
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 500,
      fontSize: "18px",
      lineHeight: "22px",
    },
    h6: {
      fontFamily: "Poppins, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 600,
      fontSize: "12px",
      lineHeight: "16px",
    },
    body1: {
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "20px",
    },
    body2: {
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "12px",
    },
    subtitle1: {
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 300,
      fontSize: "12px",
      lineHeight: "20px",
    },
    subtitle2: {
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 500,
      fontSize: "10px",
      lineHeight: "12px",
    },
    caption: {
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 400,
      fontSize: "8px",
      lineHeight: "12px",
    },
    overline: {
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 400,
      fontSize: "10px",
      lineHeight: "12px",
    },
  },
  mixins: {
    toolbar: {
      height: 34,
    },
  },
  components: {
    MuiButton: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: () => ({
          fontSize: 11,
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "42px",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        item: {
          paddingTop: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        sizeSmall: { paddingTop: 4, paddingBottom: 4 },
        root: { paddingTop: 6, paddingBottom: 6 },
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
      },
      variants: [
        {
          props: { size: "small" },
          style: {
            height: 22,
            "& .MuiChip-label": {
              fontSize: 11,
              lineHeight: 1.2,
            },
          },
        },
      ],
    },
    MuiAutocomplete: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
            {
              "-webkit-appearance": "none",
              margin: 0,
            },
          '& input[type="number"]': {
            "-moz-appearance": "textfield",
          },
        },
      },
    },
  },
  customComponents: {
    orderSummary: {
      height: 58,
    },
  },
});

export default theme;
