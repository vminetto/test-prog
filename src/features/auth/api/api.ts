import { api } from "@/lib/axios";
import type { AuthResponse } from "../types/types";


export const loginApi = (email: string, password: string) =>
api.post<AuthResponse>("/auth/login", { email, password }).then((r) => r.data);


export const registerApi = (email: string, password: string) =>
api.post<AuthResponse>("/auth/register", { email, password }).then((r) => r.data);