import AxiosMockAdapter from "axios-mock-adapter";
import { AUTH_USER_KEY, loadApps, saveApps, type Etapa } from "./storage";

type MockApplication = {
  id: number;
  jobId: number;
  userId: number;
  status: string;
  etapa: Etapa;
  createdAt: string;
  dados?: unknown;
  historico?: Array<{ date: string; etapa: Etapa; note?: string }>;
};

type Me = { id: number };

function isMockApplication(x: unknown): x is MockApplication {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "number" &&
    typeof o.jobId === "number" &&
    typeof o.userId === "number" &&
    typeof o.status === "string" &&
    typeof o.etapa === "string" &&
    typeof o.createdAt === "string"
  );
}

function getApps(): MockApplication[] {
  const raw = loadApps() as unknown;
  return Array.isArray(raw) ? (raw as unknown[]).filter(isMockApplication) : [];
}

function getMe(): Me | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof (parsed as Record<string, unknown>).id === "number") {
      return parsed as Me;
    }
    return null;
  } catch {
    return null;
  }
}

export function registerApplications(mock: AxiosMockAdapter) {
  mock.onGet("/applications/me").reply(() => {
    const me = getMe();
    if (!me) return [401, { message: "Não autenticado" }] as const;

    const apps = getApps().filter(a => a.userId === me.id);
    return [200, apps] as const;
  });

  mock.onPost(/\/jobs\/\d+\/apply$/).reply((config) => {
    const me = getMe();
    if (!me) return [401, { message: "Não autenticado" }] as const;

    const jobId = Number(config.url!.split("/")[2]);
    let payload: unknown = {};
    try { payload = JSON.parse(config.data || "{}"); } catch { /* no-op */ }

    const apps = getApps();

    const exists = apps.find(a => a.jobId === jobId && a.userId === me.id);
    if (exists) return [409, { message: "Você já se candidatou para esta vaga." }] as const;

    const id = apps.length ? Math.max(...apps.map(a => a.id)) + 1 : 1;
    const now = new Date().toISOString();

    const app: MockApplication = {
      id,
      jobId,
      userId: me.id,
      status: "pendente",
      etapa: "triagem",
      createdAt: now,
      dados: payload,
      historico: [{ date: now, etapa: "triagem" }],
    };

    apps.push(app);
    saveApps(apps);
    return [201, app] as const;
  });

  mock.onGet(/\/jobs\/\d+\/candidates$/).reply((config) => {
    const me = getMe();
    if (!me) return [401, { message: "Não autenticado" }] as const;

    const jobId = Number(config.url!.split("/")[2]);
    const apps = getApps().filter(a => a.jobId === jobId);
    return [200, apps] as const;
  });

  mock.onDelete(/\/applications\/\d+$/).reply((config) => {
    const id = Number(config.url!.split("/").pop());
    const me = getMe();
    if (!me) return [401, { message: "Não autenticado" }] as const;

    const apps = getApps();
    const idx = apps.findIndex(a => a.id === id && a.userId === me.id);
    if (idx === -1) return [404, { message: "Candidatura não encontrada" }] as const;

    const [removed] = apps.splice(idx, 1);
    saveApps(apps);
    return [200, removed] as const;
  });

  mock.onPatch(/\/applications\/\d+\/stage$/).reply((config) => {
    const me = getMe();
    if (!me) return [401] as const;

    const id = Number(config.url!.split("/")[2]);
    const body = JSON.parse(config.data || "{}") as { etapa?: Etapa; note?: string };
    if (!body.etapa) return [400, { message: "Campo 'etapa' é obrigatório" }] as const;

    const apps = getApps();
    const idx = apps.findIndex(a => a.id === id);
    if (idx === -1) return [404, { message: "Candidatura não encontrada" }] as const;

    const historico = apps[idx].historico ?? [];
    historico.push({ date: new Date().toISOString(), etapa: body.etapa, note: body.note });

    const updated: MockApplication = { ...apps[idx], etapa: body.etapa, historico };
    apps[idx] = updated;
    saveApps(apps);

    return [200, updated] as const;
  });
}
