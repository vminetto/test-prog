import * as React from "react";
import type { User } from "../types/types";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  bootstrapped: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void | Promise<void>;
  refreshProfile: () => Promise<void>;
  applyProfilePatch: (patch: Partial<User>) => void | Promise<void>;
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
