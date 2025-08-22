/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { saveToken, getToken, clearToken } from "@/lib/storage";
import type { User } from "../types/types";
import { loginApi, registerApi } from "../api/api";
import { getMyProfile } from "@/features/profile/api/api";

const AUTH_USER_KEY = "auth_user";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  bootstrapped: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void | Promise<void>;
  refreshProfile: () => Promise<void>;
  applyProfilePatch: (patch: Partial<User>) => void | Promise<void>;
}

const missingProvider = () => {
  throw new Error("AuthContext used outside of <AuthProvider>");
};

const defaultAuthContext: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  bootstrapped: false,
  login: async () => missingProvider(),
  register: async () => missingProvider(),
  logout: () => missingProvider(),
  refreshProfile: async () => missingProvider(),
  applyProfilePatch: () => missingProvider(),
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  const persistUser = useCallback((u: User | null) => {
    if (u) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(AUTH_USER_KEY);
  }, []);

  useEffect(() => {
    (async () => {
      const token = getToken();
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (token && raw) {
        try {
          const base = JSON.parse(raw) as User;
          try {
            const profile = await getMyProfile();
            const merged: User = { ...base, ...profile };
            setUser(merged);
            persistUser(merged);
          } catch {
            /* no-op: falha ao carregar perfil; usa base */
            setUser(base);
          }
        } catch {
          /* no-op: JSON inválido em AUTH_USER_KEY */
        }
      }
      setBootstrapped(true);
    })();
  }, [persistUser]);

  const refreshProfile = useCallback(async () => {
    const profile = await getMyProfile();
    setUser((prev) => {
      if (!prev) return prev;
      const merged: User = { ...prev, ...profile };
      persistUser(merged);
      return merged;
    });
  }, [persistUser]);

  const applyProfilePatch = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const merged: User = { ...prev, ...patch };
      persistUser(merged);
      return merged;
    });
  }, [persistUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginApi(email, password);
      saveToken(res.token);
      let merged = res.user as User;
      try {
        const profile = await getMyProfile();
        merged = { ...merged, ...profile };
      } catch {
        /* no-op */
      }
      setUser(merged);
      persistUser(merged);
    },
    [persistUser]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await registerApi(email, password);
      saveToken(res.token);
      let merged = res.user as User;
      try {
        const profile = await getMyProfile();
        merged = { ...merged, ...profile };
      } catch {
        /* no-op */
      }
      setUser(merged);
      persistUser(merged);
    },
    [persistUser]
  );

  const logout = useCallback(() => {
    clearToken();
    persistUser(null);
    setUser(null);
  }, [persistUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      bootstrapped,
      login,
      register,
      logout,
      refreshProfile,
      applyProfilePatch,
    }),
    [user, bootstrapped, login, register, logout, refreshProfile, applyProfilePatch]
  );

  if (!bootstrapped) return null;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
