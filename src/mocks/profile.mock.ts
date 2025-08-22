// src/mocks/profile.mock.ts
import AxiosMockAdapter from "axios-mock-adapter";
import { AUTH_USER_KEY, loadProfiles, saveProfiles } from "./storage";
import type { Profile } from "@/features/profile/types/types";

export function registerProfile(mock: AxiosMockAdapter) {
  mock.onGet("/profile/me").reply(() => {
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    if (!rawUser) return [401, { message: "Não autenticado" }];
    const u = JSON.parse(rawUser) as { id: number; email: string };

    const profiles = loadProfiles();
    const me = profiles[u.id] || { id: u.id, email: u.email };
    return [200, me] as const;
  });

  mock.onPut("/profile/me").reply((config) => {
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    if (!rawUser) return [401, { message: "Não autenticado" }];
    const u = JSON.parse(rawUser) as { id: number; email: string };

    let body: Partial<Profile> = {};
    try { body = JSON.parse(config.data || "{}"); } catch { /* no-op */ }

    const profiles = loadProfiles();
    const current = profiles[u.id] || { id: u.id, email: u.email };
    const next: Profile = { ...current, ...body, id: u.id, email: current.email };

    profiles[u.id] = next;
    saveProfiles(profiles);
    return [200, next] as const;
  });

  mock.onPut("/profile/me/avatar").reply((config) => {
    const rawUser = localStorage.getItem(AUTH_USER_KEY);
    if (!rawUser) return [401, { message: "Não autenticado" }];
    const u = JSON.parse(rawUser) as { id: number; email: string };

    let data: { avatarUrl?: string } = {};
    try { data = JSON.parse(config.data || "{}"); } catch { /* no-op */ }

    const profiles = loadProfiles();
    const current = profiles[u.id] || { id: u.id, email: u.email };
    const next: Profile = { ...current, avatarUrl: data.avatarUrl || "" };

    profiles[u.id] = next;
    saveProfiles(profiles);
    return [200, next] as const;
  });
}
