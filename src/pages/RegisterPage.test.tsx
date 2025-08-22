import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import RegisterPage from "./auth/RegisterPage";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { theme } from "@/theme";

type AuthValue = React.ContextType<typeof AuthContext>;

function renderWithProviders(ui: React.ReactElement, authValue: unknown) {
  return render(
    <AuthContext.Provider value={authValue as AuthValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <MemoryRouter initialEntries={["/register"]}>{ui}</MemoryRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

describe("RegisterPage", () => {
  it("mostra mensagens de validação quando enviar vazio", async () => {
    const registerFn = vi.fn().mockResolvedValue(undefined);

    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      bootstrapped: true,
      login: vi.fn(),
      register: registerFn,
      logout: vi.fn(),
      refreshProfile: vi.fn(),
      applyProfilePatch: vi.fn(),
    };

    renderWithProviders(<RegisterPage />, mockAuthValue);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    const errors = await screen.findAllByText(/obrigatório|inválido|min/i);
    expect(errors.length).toBeGreaterThan(0);
    expect(registerFn).not.toHaveBeenCalled();
  });

  it("chama register quando preencher email e senha válidos", async () => {
    const registerFn = vi.fn().mockResolvedValue(undefined);

    const mockAuthValue = {
      user: null,
      isAuthenticated: false,
      bootstrapped: true,
      login: vi.fn(),
      register: registerFn,
      logout: vi.fn(),
      refreshProfile: vi.fn(),
      applyProfilePatch: vi.fn(),
    };

    renderWithProviders(<RegisterPage />, mockAuthValue);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "novo@exemplo.com");
    await user.type(
      screen.getByLabelText(/senha/i, { selector: "input" }),
      "123456"
    );

    await user.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(registerFn).toHaveBeenCalledTimes(1);
      expect(registerFn).toHaveBeenCalledWith("novo@exemplo.com", "123456");
    });
  });
});
