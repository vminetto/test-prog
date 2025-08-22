import AxiosMockAdapter from "axios-mock-adapter";
import {
  AUTH_USER_KEY, TOKEN_KEY, loadUsers, saveUsers, toSafe, ensureProfileFor,
} from "./storage";

export function registerAuth(mock: AxiosMockAdapter) {
  mock.onPost("/auth/register").reply((config) => {
    const { email, password } = JSON.parse(config.data || "{}");
    if (!email || !password) return [422, { message: "Email e senha obrigatórios" }];

    const users = loadUsers();
    if (users.some(u => u.email === email)) return [409, { message: "Email já cadastrado" }];

    const newUser = { id: Date.now(), email, password };
    users.push(newUser);
    saveUsers(users);

    const token = `mock-${newUser.id}`;
    const safe = toSafe(newUser);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safe));
    ensureProfileFor(safe);

    return [200, { token, user: safe }];
  });

  mock.onPost("/auth/login").reply((config) => {
    const { email, password } = JSON.parse(config.data || "{}");
    const users = loadUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return [401, { message: "Credenciais inválidas" }];

    const token = `mock-${found.id}`;
    const safe = toSafe(found);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safe));
    ensureProfileFor(safe);

    return [200, { token, user: safe }];
  });

  mock.onGet("/auth/me").reply(() => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return [401];
    return [200, JSON.parse(raw)];
  });
}
