import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import LoginPage from "./auth/LoginPage";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { theme } from "@/theme";

type AuthValue = React.ContextType<typeof AuthContext>;

function renderWithProviders(ui: React.ReactElement, authValue: unknown) {
  return render(
     <AuthContext.Provider value={authValue as AuthValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <MemoryRouter initialEntries={["/login"]}>{ui}</MemoryRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

describe("LoginPage", () => {
  it("mostra mensagens de validação quando enviar vazio", async () => {
    const login = vi.fn().mockResolvedValue(undefined);

    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      bootstrapped: true, 
      login,
      register: vi.fn(),
      logout: vi.fn(),
      refreshProfile: vi.fn(), 
      applyProfilePatch: vi.fn(),
    };

    renderWithProviders(<LoginPage />, mockAuthValue);

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /entrar/i }));

    const errors = await screen.findAllByText(/obrigatório|required|min|inválido/i);
    expect(errors.length).toBeGreaterThan(0);
    expect(login).not.toHaveBeenCalled();
  });

  it("chama login quando preencher email e senha válidos", async () => {
    const login = vi.fn().mockResolvedValue(undefined);

    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      bootstrapped: true,
      login,
      register: vi.fn(),
      logout: vi.fn(),
      refreshProfile: vi.fn(),
      applyProfilePatch: vi.fn(),
    };

    renderWithProviders(<LoginPage />, mockAuthValue);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "teste@example.com");
    await user.type(screen.getByLabelText(/senha/i, { selector: 'input' }), "123456");

    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledTimes(1);
      expect(login).toHaveBeenCalledWith("teste@example.com", "123456");
    });
  });
});
