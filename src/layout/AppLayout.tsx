import { Suspense } from "react";
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth";
import UserMenu from "@/components/userMenu/UserMenu";
import logo from "@/assets/reduced_logo.svg";

export default function AppLayout() {
    const { user } = useAuth();

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
            <AppBar position="static" color="primary" elevation={0}>
                <Toolbar>
                    <Box
                        component={RouterLink}
                        to="/dashboard"
                        sx={{ mr: 1, display: "inline-flex", alignItems: "center", textDecoration: "none", color: "inherit" }}
                        aria-label="Ir para o dashboard"
                    >
                        <Box component="img" src={logo} alt="Recrutamento Frontend" sx={{ height: 40, width: "auto", display: "block" }} />
                    </Box>

                    <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
                        Recrutamento & Seleção
                    </Typography>

                    <Typography variant="body2" sx={{ mr: 1, opacity: 0.9, display: { xs: "none", sm: "block" } }}>
                        {user?.email}
                    </Typography>

                    <UserMenu email={user?.email} avatarUrl={user?.avatarUrl} />
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Suspense fallback={null}>
                    <Outlet />
                </Suspense>
            </Container>
        </Box>
    );
}
