import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth";
import {
  Button, CssBaseline, TextField, Typography, Box, Alert, Link as MuiLink,
} from "@mui/material";
import { useState } from "react";
import AuthLayout from "@/layout/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import logo from "@/assets/reduced_logo.svg";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import PasswordField from "@/components/form/PasswordField";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});
type FormData = z.infer<typeof schema>;

type LocationState = { from?: { pathname: string } } | null;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = ((location.state as LocationState)?.from?.pathname) ?? "/dashboard";
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      await registerUser(data.email, data.password);
      navigate(from, { replace: true });
    } catch (e: unknown) {
      const msg =
        typeof e === "object" && e && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setApiError(msg || "Erro no cadastro");
    }
  };

  return (
    <AuthLayout>
      <CssBaseline />
      <AuthCard>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <Box component="img" src={logo} alt="Logo" sx={{ width: 80 }} />
          <Typography component="h1" variant="h5">Criar conta</Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: "100%" }}>
            {apiError && <Alert severity="error">{apiError}</Alert>}

            <TextField
              margin="normal"
              fullWidth
              label="Email"
              autoComplete="email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <PasswordField
              margin="normal"
              fullWidth
              label="Senha"
              autoComplete="new-password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ mt: 3, mb: 1 }}>
              {isSubmitting ? "Cadastrando..." : "Criar conta"}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Já tem cadastro?{" "}
              <MuiLink component={RouterLink} to="/login" underline="hover">Entrar</MuiLink>
            </Typography>
          </Box>
        </Box>
      </AuthCard>
    </AuthLayout>
  );
}
