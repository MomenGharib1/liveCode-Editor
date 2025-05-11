import { createTheme } from "@mui/material/styles";

const berryTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
      contrastText: "#fff",
    },
    secondary: {
      main: "#14b8a6",
      light: "#2dd4bf",
      dark: "#0d9488",
      contrastText: "#fff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
    grey: {
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      letterSpacing: "-0.025em",
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const berryDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#818cf8",
      light: "#a5b4fc",
      dark: "#6366f1",
      contrastText: "#fff",
    },
    secondary: {
      main: "#2dd4bf",
      light: "#5eead4",
      dark: "#14b8a6",
      contrastText: "#fff",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
    },
    grey: {
      100: "#1e293b",
      200: "#334155",
      300: "#475569",
    },
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      letterSpacing: "-0.025em",
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export { berryTheme, berryDarkTheme };
