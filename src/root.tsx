import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import { theme } from "./theme";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "./features/auth/context/AuthContext";

function Fallback() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        bgcolor: "transparent",
        color: "text.secondary",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <CircularProgress size={28} />
      </Box>
    </Box>
  );
}

export default function Root() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        preventDuplicate
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <AuthProvider>
          <Suspense fallback={<Fallback />}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
