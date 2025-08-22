// src/mocks/storage.ts
import type { Profile } from "@/features/profile/types/types";

export const USERS_KEY   = "mock_users";
export const TOKEN_KEY   = "auth_token";
export const AUTH_USER_KEY = "auth_user";
export const PROFILE_KEY = "mock_profiles";
export const JOBS_KEY    = "mock_jobs";
export const APPS_KEY    = "mock_apps";

export type User = { id: number; email: string; password: string };
export type SafeUser = { id: number; email: string };

export type Etapa =
  | "triagem"
  | "entrevista_tecnica"
  | "cultural"
  | "oferta"
  | "contratado"
  | "rejeitado";

export function load<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
export function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadUsers(): User[] { return load<User[]>(USERS_KEY, []); }
export function saveUsers(users: User[]) { save(USERS_KEY, users); }
export function toSafe(u: User): SafeUser { return { id: u.id, email: u.email }; }

export function loadJobs() { return load<unknown[]>(JOBS_KEY, []); }
export function saveJobs(jobs: unknown[]) { save(JOBS_KEY, jobs); }

export function loadApps() { return load<unknown[]>(APPS_KEY, []); }
export function saveApps(apps: unknown[]) { save(APPS_KEY, apps); }

export function loadProfiles(): Record<number, Profile> { return load(PROFILE_KEY, {} as Record<number, Profile>); }
export function saveProfiles(map: Record<number, Profile>) { save(PROFILE_KEY, map); }

export function ensureProfileFor(user: SafeUser) {
  const profiles = loadProfiles();
  if (!profiles[user.id]) {
    profiles[user.id] = {
      id: user.id,
      email: user.email,
      name: "",
      phone: "",
      cpf: "",
      linkedin: "",
      avatarUrl: "",
    };
    saveProfiles(profiles);
  }
}

export function seed() {
  if (!localStorage.getItem(USERS_KEY)) saveUsers([]);
  if (!localStorage.getItem(JOBS_KEY)) {
    saveJobs([
      { id: 1, title: "Dev Frontend Sr", description: "React, TS, Vite", location: "Remoto", ownerId: 1 },
      { id: 2, title: "Dev Backend Go",   description: "Gin, GORM, Postgres", location: "SP",     ownerId: 2 },
    ]);
  }
  if (!localStorage.getItem(APPS_KEY)) saveApps([]);
  if (!localStorage.getItem(PROFILE_KEY)) saveProfiles({});
}
