import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6D28D9",   // roxo principal
      light: "#8B5CF6",
      dark: "#5B21B6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9333EA",
      light: "#A855F7",
      dark: "#7E22CE",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0F0A1F",  // fundo geral escuro roxo
      paper: "#ffffff",
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial`,
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg,#4C1D95 0%, #7C3AED 60%, #A855F7 100%)",
          boxShadow: "0 4px 20px rgba(124,58,237,0.25)",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
          background:
            "linear-gradient(90deg, #7C3AED 0%, #A855F7 50%, #C084FC 100%)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid rgba(124,58,237,0.12)",
          boxShadow:
            "0 6px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(124,58,237,0.06) inset",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background:
            "linear-gradient(180deg, #7C3AED 0%, #6D28D9 90%)",
          boxShadow: "0 8px 24px rgba(109,40,217,0.35)",
          ":hover": { filter: "brightness(1.05)" },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "medium" },
    },
  },
});
